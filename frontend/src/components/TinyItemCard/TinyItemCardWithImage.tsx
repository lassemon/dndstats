import useItemWithImage from 'hooks/useItemWithImage'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import ItemRepository from 'infrastructure/repositories/ItemRepository'
import TinyItemCard from './TinyItemCard'
import { ImageDTO, ItemDTO } from '@dmtool/application'
import { useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

interface TinyItemCardWithImageProps {
  item: ItemDTO | null
  className?: string
}

const imageRepository = new ImageRepository()

export const TinyItemCardWithImage: React.FC<TinyItemCardWithImageProps> = ({ item, className }) => {
  const imageId = item?.imageId
  const [loadingImage, setLoadingImage] = useState(false)
  const [image, setImage] = useState<ImageDTO | null | undefined>(null)
  const imageRequestControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const fetchAndSetImage = async (_imageId: string) => {
      try {
        setLoadingImage(true)
        const controller = new AbortController()
        imageRequestControllerRef.current = controller
        const fetchedImage = await imageRepository.getById(_imageId, { signal: controller.signal })
        unstable_batchedUpdates(() => {
          setLoadingImage(false)
          setImage(new ImageDTO(fetchedImage))
        })
      } catch (error) {
        setLoadingImage(false)
      }
    }
    if (imageId) {
      fetchAndSetImage(imageId)
    }
  }, [imageId])

  return <TinyItemCard item={item} image={image} loadingImage={loadingImage} className={className} />
}

export default TinyItemCardWithImage
