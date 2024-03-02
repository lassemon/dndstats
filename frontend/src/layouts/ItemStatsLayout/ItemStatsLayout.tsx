import ItemStats from 'components/ItemStats'
import ItemStatsInput from 'components/ItemStatsInput'
import useItemWithImage from 'hooks/useItemWithImage'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import ItemRepository from 'infrastructure/repositories/ItemRepository'
import { useAtom } from 'jotai'
import StatsLayout from 'layouts/StatsLayout'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const itemRepository = new ItemRepository()
const imageRepository = new ImageRepository()

const ItemStatsLayout: React.FC = () => {
  let { itemId: urlPartItemId } = useParams<{ itemId: string }>()
  const [itemId, setItemId] = useState(urlPartItemId)
  const [authState] = useAtom(authAtom)
  const [screenshotMode, setScreenshotMode] = useState(false)

  const [{ item, backendItem, setBackendItem, loadingItem, image, loadingImage }, setItem, setImage] = useItemWithImage(
    itemRepository,
    imageRepository,
    itemId,
    {
      persist: !authState.loggedIn
    }
  )

  useEffect(() => {
    // for when fetched image from the backend and we got the backend image id
    if (item && image?.id) {
      setItem(item.clone({ imageId: image.id }))
    }
  }, [image])

  const itemProps = {
    item: item,
    persistedItem: backendItem,
    setPersistedItem: setBackendItem,
    setItem: setItem,
    setItemId: setItemId,
    loadingItem: loadingItem,
    itemRepository: itemRepository
  }

  const imageProps = {
    setImage: setImage,
    image: image,
    loadingImage: loadingImage
  }

  return (
    <StatsLayout
      screenshotMode={screenshotMode}
      statsComponent={
        <ItemStats item={item} image={image} loadingImage={loadingImage} loadingItem={loadingItem} screenshotMode={screenshotMode} />
      }
      inputComponent={
        <ItemStatsInput {...itemProps} {...imageProps} screenshotMode={screenshotMode} setScreenshotMode={setScreenshotMode} />
      }
    />
  )
}

export default ItemStatsLayout
