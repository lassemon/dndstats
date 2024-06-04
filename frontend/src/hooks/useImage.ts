import {
  BrowserImageProcessingService,
  HttpImageRepositoryInterface,
  ImageDTO,
  LocalStorageImageRepositoryInterface
} from '@dmtool/application'
import { useEffect, useRef, useState } from 'react'
import { UpdateParam } from 'state/itemAtom'
import { StorageSyncError } from 'domain/errors/StorageError'

type UseImageReturn = [
  { loading: boolean; image: ImageDTO | null | undefined; error?: any },
  (update: UpdateParam<ImageDTO | null | undefined>) => void
]

const DEBUG = false
const imageProcessingService = new BrowserImageProcessingService()

const useImage = (
  imageRepository: LocalStorageImageRepositoryInterface | HttpImageRepositoryInterface,
  imageId?: string | null
): UseImageReturn => {
  const controllerRef = useRef<AbortController | null>(null)

  const [image, setImage] = useState<ImageDTO | null | undefined>(null)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAndSetImage = async (_imageId: string) => {
      if (isLoading) {
        return
      } else {
        try {
          setIsLoading(true)
          const controller = new AbortController()
          controllerRef.current = controller

          const fetchedImage = await Promise.resolve(imageRepository.getById(_imageId, { signal: controller.signal }))
          setIsLoading(false)

          setImage(new ImageDTO(fetchedImage))
          //setPersistedImage(new ImageDTO(fetchedImage))
        } catch (error) {
          setIsLoading(false)
          setError(error)
        }
      }
    }

    const imageIdExists = !!imageId
    const imageIdIsTheSameAsSavedImage = imageId === image?.id
    const imageExists = !!image
    const isTempImage = imageId?.startsWith('temp-')
    const shouldFetchImage =
      (!isTempImage && imageIdExists && !imageIdIsTheSameAsSavedImage) || (!isTempImage && imageIdExists && !imageExists)

    DEBUG && console.log('\n\n====')
    DEBUG && console.log('useImage - imageId', imageId)
    DEBUG && console.log('useImage - imageIdExists', imageIdExists)
    DEBUG && console.log('useImage - imageExists', imageExists)
    DEBUG && console.log('useImage - imageIdIsTheSameAsSavedImage', imageIdIsTheSameAsSavedImage)
    DEBUG && console.log('useImage - isTempImage', isTempImage)
    DEBUG && console.log('useImage - image', image)
    DEBUG && console.log('useImage - shouldFetchImage', shouldFetchImage)
    DEBUG && console.log('useImage - imageId', imageId)
    DEBUG && console.log('===\n\n')

    if (shouldFetchImage) {
      fetchAndSetImage(imageId)
    }

    return () => {
      controllerRef?.current?.abort()
    }
  }, [imageId])

  const imageState = {
    loading: isLoading,
    image: imageId === image?.id ? image : null,
    ...(error ? { error: error } : {})
  }

  const imageSetter = (update: UpdateParam<ImageDTO | null | undefined>) => {
    let parsedValue = update instanceof Function ? update(image) : update
    try {
      imageProcessingService.resizeImage(parsedValue?.base64 || '', { maxWidth: 320 }, (base64Image: string) => {
        if (parsedValue) {
          parsedValue.base64 = base64Image
        }
        setImage(parsedValue)
      })
    } catch (error: any) {
      setError(new StorageSyncError('Saving image failed: ' + error.message))
    }
  }

  return [imageState, imageSetter]
}

export default useImage
