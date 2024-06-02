import ItemStats from 'components/ItemStats'
import ItemStatsInput from 'components/ItemStatsInput'
import useItemWithImage from 'hooks/useItemWithImage'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import ItemRepository from 'infrastructure/repositories/ItemRepository'
import StatsLayout from 'layouts/StatsLayout'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import config from 'config'

const itemRepository = new ItemRepository()
const imageRepository = new ImageRepository()

const ItemStatsLayout: React.FC = () => {
  let { itemId: urlPartItemId } = useParams<{ itemId: string }>()
  const [urlItemId, setItemId] = useState(urlPartItemId)
  const navigate = useNavigate()
  const [screenshotMode, setScreenshotMode] = useState(false)
  const [showSecondaryCategories, setShowSecondaryCategories] = useState<boolean>(true)
  const [lockToPortrait, setLockToPortrait] = useState<boolean>(false)
  const [hideBgBrush, setHideBgBrush] = useState<boolean>(false)
  const [savingItem, setSavingItem] = useState<boolean>(false)

  const [{ item, backendItem, setBackendItem, loadingItem, image, loadingImage }, setItem, setImage] = useItemWithImage(
    itemRepository,
    imageRepository,
    urlItemId,
    {
      persist: true
    }
  )

  const itemId = item?.id

  useEffect(() => {
    // when not logged in user modifies item OR when authenticated user saves a new item,
    // we always change the item id
    // we also need to change that id into the url and urlItemId, so that
    // useItemWithImage does not load the item from the backend
    if (itemId) {
      setItemId(itemId)
      navigate(`${config.cardPageRoot}/item/${itemId}`)
    }
  }, [itemId])

  useEffect(() => {
    // for when fetched image from the backend and we got the backend image id
    if (item && image?.id) {
      setItem(item.clone({ imageId: image.id }))
    }
  }, [image])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const itemProps = {
    item: item,
    backendItem,
    setBackendItem,
    setItem: setItem,
    setItemId: setItemId,
    loadingItem: loadingItem,
    itemRepository,
    imageRepository
  }

  const imageProps = {
    setImage: setImage,
    image: image,
    loadingImage: loadingImage
  }

  return (
    <StatsLayout
      screenshotMode={screenshotMode}
      alwaysPortrait={lockToPortrait}
      statsComponent={
        <ItemStats
          item={item}
          image={image}
          loadingImage={loadingImage}
          loadingItem={loadingItem}
          savingItem={savingItem}
          showSecondaryCategories={showSecondaryCategories}
          hideBgBrush={hideBgBrush}
          screenshotMode={screenshotMode}
        />
      }
      inputComponent={
        <ItemStatsInput
          {...itemProps}
          {...imageProps}
          showSecondaryCategories={showSecondaryCategories}
          setShowSecondaryCategories={setShowSecondaryCategories}
          lockToPortrait={lockToPortrait}
          setLockToPortrait={setLockToPortrait}
          hideBgBrush={hideBgBrush}
          setHideBgBrush={setHideBgBrush}
          screenshotMode={screenshotMode}
          setScreenshotMode={setScreenshotMode}
          savingItem={savingItem}
          setSavingItem={setSavingItem}
        />
      }
    />
  )
}

export default ItemStatsLayout
