import { Item } from '@dmtool/domain'
import ItemTable from 'components/ItemTable/ItemTable'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import { errorAtom } from 'infrastructure/dataAccess/atoms'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import ItemRepository from 'infrastructure/repositories/ItemRepository'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  root: {
    margin: '2em'
  }
}))

const itemRepository = new ItemRepository()
const imageRepository = new ImageRepository()

const ItemsPage: React.FC = () => {
  const { classes } = useStyles()

  const [itemList, setItemList] = useState<Item[]>([])
  const [loadingItemList, setLoadingItemList] = useState(false)
  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))

  useEffect(() => {
    const fetchAndSetItems = async () => {
      try {
        setLoadingItemList(true)
        const items = await itemRepository.getAll().finally(() => {
          setLoadingItemList(false)
        })
        setItemList(items)
      } catch (error: any) {
        setError(error)
      }
    }

    fetchAndSetItems()
    //TODO return abort with AbortController
  }, [])

  return (
    <div className={classes.root}>
      <PageHeader>Items</PageHeader>
      {loadingItemList ? <LoadingIndicator /> : <ItemTable items={itemList} imageRepository={imageRepository} />}
    </div>
  )
}

export default ItemsPage
