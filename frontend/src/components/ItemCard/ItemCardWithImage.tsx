import ImageRepository from 'infrastructure/repositories/ImageRepository'
import ItemCard from './ItemCard'
import { ImageDTO, ItemDTO } from '@dmtool/application'
import { useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

interface ItemCardWithImageProps {
  item: ItemDTO | null
  loadingItem: boolean
  savingItem?: boolean
  showSecondaryCategories?: boolean
  hideBgBrush?: boolean
  inlineFeatures?: boolean
  className?: string
}

const imageRepository = new ImageRepository()

export const ItemCardWithImage: React.FC<ItemCardWithImageProps> = ({
  item,
  loadingItem,
  savingItem = false,
  showSecondaryCategories = false,
  hideBgBrush = false,
  inlineFeatures = false,
  className
}) => {
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
    } else {
      setImage(null)
    }
  }, [imageId])

  return (
    <ItemCard
      item={item}
      loadingItem={loadingItem}
      image={image}
      loadingImage={loadingImage}
      savingItem={savingItem}
      showSecondaryCategories={showSecondaryCategories}
      hideBgBrush={hideBgBrush}
      inlineFeatures={inlineFeatures}
      className={className}
    />
  )
}

export default ItemCardWithImageProps
