import { ItemDTO, ItemSearchRequest } from '@dmtool/application'
import { ComparisonOption } from '@dmtool/domain'
import ItemTable from 'components/ItemTable/ItemTable'
import PageHeader from 'components/PageHeader'
import { authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import ItemRepository from 'infrastructure/repositories/ItemRepository'
import { useAtom } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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

  const fetchItemsControllerRef = useRef<AbortController | null>(null)

  const [itemList, setItemList] = useState<ItemDTO[]>([])
  const [loadingItemList, setLoadingItemList] = useState(false)
  let [searchParams, setSearchParams] = useSearchParams()
  const [itemTableFilters, setItemTableFilters] = useState<ItemSearchRequest>({
    itemsPerPage: parseInt(searchParams.get('itemsPerPage') || String(10)),
    pageNumber: parseInt(searchParams.get('pageNumber') || String(0)),
    onlyMyItems: searchParams.get('onlyMyItems') === 'true' || false,
    visibility: (searchParams.getAll('visibility') as ItemSearchRequest['visibility']) || [],
    rarity: (searchParams.getAll('rarity') as ItemSearchRequest['rarity']) || [],
    source: (searchParams.getAll('source') as ItemSearchRequest['source']) || [],
    priceComparison: (searchParams.get('priceComparison') as ComparisonOption) || 'exactly',
    priceQuantity: parseInt(searchParams.get('priceQuantity') || '') || undefined,
    priceUnit: searchParams.get('priceUnit') || '',
    weightComparison: (searchParams.get('weightComparison') as ComparisonOption) || 'exactly',
    weight: parseInt(searchParams.get('weight') || '') || undefined
  })
  const [totalCount, setTotalCount] = React.useState(0)
  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const [authState] = useAtom(authAtom)

  const fetchAndSetItems = async () => {
    try {
      setLoadingItemList(true)
      const controller = new AbortController()
      fetchItemsControllerRef.current = controller
      const itemSearchResponse = await itemRepository
        .search(
          {
            itemsPerPage: itemTableFilters.itemsPerPage,
            pageNumber: itemTableFilters.pageNumber,
            onlyMyItems: itemTableFilters.onlyMyItems,
            visibility: itemTableFilters.visibility,
            rarity: itemTableFilters.rarity,
            priceComparison: itemTableFilters.priceComparison,
            priceQuantity: itemTableFilters.priceQuantity,
            priceUnit: itemTableFilters.priceUnit,
            weightComparison: itemTableFilters.weightComparison,
            weight: itemTableFilters.weight
          },
          { signal: controller.signal }
        )
        .finally(() => {
          setLoadingItemList(false)
        })
      setItemList(itemSearchResponse.items.map((item) => new ItemDTO(item)))
      setTotalCount(itemSearchResponse.totalCount)
    } catch (error: any) {
      setError(error)
    }
  }

  useEffect(() => {
    setSearchParams({
      pageNumber: String(itemTableFilters.pageNumber),
      itemsPerPage: String(itemTableFilters.itemsPerPage),
      ...(authState.loggedIn ? { onlyMyItems: String(itemTableFilters.onlyMyItems) } : {}),
      visibility: itemTableFilters.visibility || [],
      rarity: itemTableFilters.rarity || [],
      source: itemTableFilters.source || [],
      ...(itemTableFilters.priceQuantity && itemTableFilters.priceComparison ? { priceComparison: itemTableFilters.priceComparison } : {}),
      ...(itemTableFilters.priceQuantity ? { priceQuantity: String(itemTableFilters.priceQuantity) } : {}),
      ...(itemTableFilters.priceQuantity && itemTableFilters.priceUnit ? { priceUnit: itemTableFilters.priceUnit || '' } : {}),
      ...(itemTableFilters.weight && itemTableFilters.weightComparison ? { weightComparison: itemTableFilters.weightComparison } : {}),
      ...(itemTableFilters.weight ? { weight: String(itemTableFilters.weight) } : {})
    })
  }, [itemTableFilters])

  useEffect(() => {
    fetchAndSetItems()
    return () => {
      fetchItemsControllerRef?.current?.abort()
    }
  }, [authState.loggedIn, itemTableFilters.itemsPerPage, itemTableFilters.pageNumber, itemTableFilters.onlyMyItems])

  useEffect(() => {
    return () => {
      fetchItemsControllerRef?.current?.abort()
    }
  }, [])

  const onSearch = () => {
    fetchAndSetItems()
  }

  return (
    <div className={classes.root}>
      <PageHeader>Items</PageHeader>
      <ItemTable
        itemRepository={itemRepository}
        items={itemList}
        imageRepository={imageRepository}
        setItemList={setItemList}
        itemTableFilters={itemTableFilters}
        onSearch={onSearch}
        setItemTableFilters={setItemTableFilters}
        totalCount={totalCount}
        loading={loadingItemList}
      />
    </div>
  )
}

export default ItemsPage
