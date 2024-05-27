import { ItemDTO, ItemSearchRequest } from '@dmtool/application'
import { Order } from '@dmtool/common'
import { ComparisonOption, ItemSortableKeys } from '@dmtool/domain'
import ItemTable from 'components/ItemTable/ItemTable'
import ItemTableFilters from 'components/ItemTable/ItemTableFilters'
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

export const defaultFilters = {
  itemsPerPage: 50,
  pageNumber: 0,
  orderBy: 'name',
  order: Order.ASCENDING
}

const itemRepository = new ItemRepository()
const imageRepository = new ImageRepository()

const ItemsPage: React.FC = () => {
  const { classes } = useStyles()

  const fetchItemsControllerRef = useRef<AbortController | null>(null)

  const [itemList, setItemList] = useState<ItemDTO[]>([])
  const [loadingItemList, setLoadingItemList] = useState(false)
  let [searchParams, setSearchParams] = useSearchParams()
  const [itemTableFilters, setItemTableFilters] = useState<ItemSearchRequest>({
    itemsPerPage: parseInt(searchParams.get('itemsPerPage') || String(defaultFilters.itemsPerPage)),
    pageNumber: parseInt(searchParams.get('pageNumber') || String(defaultFilters.pageNumber)),
    onlyMyItems: searchParams.get('onlyMyItems') === 'true' || false,
    search: searchParams.get('search') || undefined,
    order: (searchParams.get('order') as `${Order}`) || defaultFilters.order,
    orderBy: searchParams.get('orderBy') || defaultFilters.orderBy,
    visibility: (searchParams.getAll('visibility') as ItemSearchRequest['visibility']) || [],
    category: (searchParams.getAll('category') as ItemSearchRequest['category']) || [],
    rarity: (searchParams.getAll('rarity') as ItemSearchRequest['rarity']) || [],
    source: (searchParams.getAll('source') as ItemSearchRequest['source']) || [],
    priceComparison: (searchParams.get('priceComparison') as ComparisonOption) || ComparisonOption.EXACTLY,
    priceQuantity: searchParams.get('priceQuantity') || undefined,
    priceUnit: searchParams.get('priceUnit') || '',
    weightComparison: (searchParams.get('weightComparison') as ComparisonOption) || ComparisonOption.EXACTLY,
    weight: searchParams.get('weight') || undefined,
    requiresAttunement: searchParams.get('requiresAttunement') === 'true' || null
  })
  const [totalCount, setTotalCount] = React.useState(0)
  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const [authState] = useAtom(authAtom)

  const fetchAndSetItems = async (filters: ItemSearchRequest) => {
    try {
      setLoadingItemList(true)
      const controller = new AbortController()
      fetchItemsControllerRef.current = controller
      const itemSearchResponse = await itemRepository.search(filters, { signal: controller.signal }).finally(() => {
        setLoadingItemList(false)
      })
      setItemList(itemSearchResponse.items.map((item) => new ItemDTO(item)))
      setTotalCount(itemSearchResponse.totalCount)
    } catch (error: any) {
      if (!(error instanceof DOMException)) {
        setError(error)
      }
    }
  }

  useEffect(() => {
    setSearchParams({
      pageNumber: String(itemTableFilters.pageNumber || defaultFilters.pageNumber),
      itemsPerPage: String(itemTableFilters.itemsPerPage || defaultFilters.itemsPerPage),
      order: String(itemTableFilters.order || defaultFilters.order),
      orderBy: String(itemTableFilters.orderBy || defaultFilters.orderBy),
      ...(authState.loggedIn ? { onlyMyItems: String(itemTableFilters.onlyMyItems || 'false') } : {}),
      visibility: itemTableFilters.visibility || [],
      category: itemTableFilters.category || [],
      rarity: itemTableFilters.rarity || [],
      source: itemTableFilters.source || [],
      ...(itemTableFilters.search && itemTableFilters.search ? { search: itemTableFilters.search } : { search: '' }),
      ...(itemTableFilters.priceQuantity && itemTableFilters.priceComparison ? { priceComparison: itemTableFilters.priceComparison } : {}),
      ...(itemTableFilters.priceQuantity ? { priceQuantity: String(itemTableFilters.priceQuantity) } : {}),
      ...(itemTableFilters.priceQuantity && itemTableFilters.priceUnit ? { priceUnit: itemTableFilters.priceUnit || '' } : {}),
      ...(itemTableFilters.weight && itemTableFilters.weightComparison ? { weightComparison: itemTableFilters.weightComparison } : {}),
      ...(itemTableFilters.weight ? { weight: String(itemTableFilters.weight) } : {}),
      ...(itemTableFilters.requiresAttunement ? { requiresAttunement: String(itemTableFilters.requiresAttunement) } : {}),
      ...(itemTableFilters.hasImage ? { hasImage: String(itemTableFilters.hasImage) } : {})
    })
  }, [itemTableFilters])

  useEffect(() => {
    fetchAndSetItems({ ...defaultFilters, ...itemTableFilters })
  }, [
    authState.loggedIn,
    itemTableFilters.itemsPerPage,
    itemTableFilters.pageNumber,
    itemTableFilters.onlyMyItems,
    itemTableFilters.order,
    itemTableFilters.orderBy
  ])

  useEffect(() => {
    return () => {
      fetchItemsControllerRef?.current?.abort()
    }
  }, [])

  const onSearch = (filters: Omit<ItemSearchRequest, 'order' | 'orderBy'>) => {
    const allFilters = { ...defaultFilters, ...filters, order: itemTableFilters.order, orderBy: itemTableFilters.orderBy }
    setItemTableFilters(allFilters)
    fetchAndSetItems(allFilters)
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: (typeof ItemSortableKeys)[number]) => {
    const isAsc = itemTableFilters.orderBy === property && itemTableFilters.order === 'asc'
    setItemTableFilters({ ...defaultFilters, ...itemTableFilters, order: isAsc ? Order.DESCENDING : Order.ASCENDING, orderBy: property })
  }

  return (
    <div className={classes.root}>
      <PageHeader>Items</PageHeader>
      <ItemTableFilters onSearch={onSearch} filters={itemTableFilters} setFilters={setItemTableFilters} loading={loadingItemList} />
      <ItemTable
        itemRepository={itemRepository}
        items={itemList}
        imageRepository={imageRepository}
        setItemList={setItemList}
        pageNumber={itemTableFilters.pageNumber && totalCount > 0 ? itemTableFilters.pageNumber : defaultFilters.pageNumber}
        itemsPerPage={itemTableFilters.itemsPerPage || defaultFilters.itemsPerPage}
        search={itemTableFilters.search}
        setItemTableFilters={setItemTableFilters}
        onRequestSort={handleRequestSort}
        order={itemTableFilters.order}
        orderBy={itemTableFilters.orderBy}
        totalCount={totalCount}
        loading={loadingItemList}
      />
    </div>
  )
}

export default ItemsPage
