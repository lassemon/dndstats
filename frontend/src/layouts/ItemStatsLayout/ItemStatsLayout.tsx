import ItemStats from 'components/ItemStats'
import ItemStatsInput from 'components/ItemStatsInput'
import useImage from 'hooks/useImage'
import useItem from 'hooks/useItem'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import ItemRepository from 'infrastructure/repositories/ItemRepository'
import StatsLayout from 'layouts/StatsLayout'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ItemStatsLayout: React.FC = () => {
  const itemRepository = new ItemRepository()
  const imageRepository = new ImageRepository()
  let { itemId: urlPartItemId } = useParams<{ itemId: string }>()
  const [itemId, setItemId] = useState(urlPartItemId || 'defaultItem')

  const [{ item, persistedItem, setPersistedItem, loading: loadingItem }, setItem] = useItem(itemRepository, itemId)
  const [{ image, loading: loadingImage }, setImage] = useImage(imageRepository, item?.imageId)

  useEffect(() => {
    if (item && image?.id) {
      setItem(item.clone({ imageId: image.id }))
    }
  }, [image])

  useEffect(() => {
    setItemId(urlPartItemId || 'defaultItem')
  }, [urlPartItemId])

  //console.log('item in layout', item)
  //console.log('image in layout', image)

  return (
    <StatsLayout
      statsComponent={
        <ItemStats
          item={item}
          persistedItem={persistedItem}
          setPersistedItem={setPersistedItem}
          setItem={setItem}
          setItemId={setItemId}
          loadingItem={loadingItem}
          setImage={setImage}
          itemRepository={itemRepository}
          image={image}
          loadingImage={loadingImage}
        />
      }
      inputComponent={<ItemStatsInput item={item} setItem={setItem} itemRepository={itemRepository} setImage={setImage} />}
    />
  )
}

export default ItemStatsLayout
