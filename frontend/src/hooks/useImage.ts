import { HttpImageRepositoryInterface, ImageDTO, LocalStorageImageRepositoryInterface } from '@dmtool/application'
import { useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { UpdateParam } from 'state/itemAtom'
import { atomWithStorage } from 'jotai/utils'
import { StorageSyncError } from 'domain/errors/StorageError'

type UseImageReturn = [
  { loading: boolean; image: ImageDTO | null | undefined; error?: any },
  (update: UpdateParam<ImageDTO | null | undefined>) => void
]

const localStorageImageAtom = atomWithStorage<ImageDTO | null | undefined>('localImageAtom', null)

export interface UseImageOptions {
  persist?: boolean
}

const useImage = (
  imageRepository: LocalStorageImageRepositoryInterface | HttpImageRepositoryInterface,
  imageId: string | null,
  options: UseImageOptions = { persist: false }
): UseImageReturn => {
  const { persist } = options

  const controllerRef = useRef<AbortController | null>(null)

  const [image, setImage] = useState<ImageDTO | null | undefined>(null)
  const [persistedImage, setPersistedImage] = useAtom(localStorageImageAtom)
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
          setPersistedImage(new ImageDTO(fetchedImage))
        } catch (error) {
          setIsLoading(false)
          setError(error)
        }
      }
    }

    const imageIdExists = !!imageId
    const imageIdIsTheSameAsSavedImage = imageId === (persist ? persistedImage?.id : image?.id)
    const imageExists = persist ? !!persistedImage : !!image

    if ((imageIdExists && !imageIdIsTheSameAsSavedImage) || (imageIdExists && !imageExists)) {
      fetchAndSetImage(imageId)
    }

    return () => {
      controllerRef?.current?.abort()
    }
  }, [imageId])

  const returnImage = (persist === true ? persistedImage : image) || null

  const imageState = {
    loading: isLoading,
    image: !!imageId ? returnImage : null,
    ...(error ? { error: error } : {})
  }

  const imageSetter = (update: UpdateParam<ImageDTO | null | undefined>) => {
    let parsedValue = update instanceof Function ? update(image) : update
    setImage(parsedValue)
    setPersistedImage(parsedValue)
    try {
      setPersistedImage(parsedValue)
    } catch (error: any) {
      setError(new StorageSyncError(error.message))
    }
  }

  return [imageState, imageSetter]
}

export default useImage
