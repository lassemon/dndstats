import { HttpImageRepositoryInterface, ImageDTO } from '@dmtool/application'
import { useEffect, useRef, useState } from 'react'
import { UpdateParam } from 'state/itemAtom'

type UseImageReturn = [{ loading: boolean; image: ImageDTO | null; error?: any }, (update: UpdateParam<ImageDTO | null | undefined>) => void]

const useImage = (imageRepository: HttpImageRepositoryInterface, imageId?: string | null): UseImageReturn => {
  const controllerRef = useRef<AbortController | null>(null)

  const [image, setImage] = useState<ImageDTO | null | undefined>(null)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAndSetImage = async (_imageId: string) => {
      try {
        setIsLoading(true)
        const controller = new AbortController()
        controllerRef.current = controller
        const fetchedImage = await imageRepository.getById(_imageId, { signal: controller.signal }).finally(() => {
          setIsLoading(false)
        })
        setImage(new ImageDTO(fetchedImage))
      } catch (error) {
        setError(error)
      }
    }

    //console.log(`\n\n\nshould I fetch image? imageId:${imageId}`, image)
    const imageIdExists = !!imageId
    const imageIdIsTheSameAsSavedImage = imageId === image?.id
    const imageExists = !!image

    //console.log('imageIdExists', imageIdExists)
    //console.log('imageIdIsTheSameAsSavedImage', imageIdIsTheSameAsSavedImage)
    //console.log('imageExists', imageExists)

    //console.log('should i fetch image', (imageIdExists && !imageIdIsTheSameAsSavedImage) || (imageIdExists && !imageExists))

    if ((imageIdExists && !imageIdIsTheSameAsSavedImage) || (imageIdExists && !imageExists)) {
      fetchAndSetImage(imageId)
    } else if (!imageId) {
      setImage(null)
    }

    return () => {
      controllerRef?.current?.abort()
    }
  }, [imageId])

  const imageState = {
    loading: isLoading,
    image: image || null,
    ...(error ? { error: error } : {})
  }

  return [imageState, setImage]
}

export default useImage
