import { ItemDTO, ItemSearchRequest } from '@dmtool/application'
import { Order } from '@dmtool/common'
import { ComparisonOption, ItemSortableKeys } from '@dmtool/domain'
import ItemTable from 'components/ItemTable'
import ItemTableFilters from 'components/ItemTable/ItemTableFilters'
import PageHeader from 'components/PageHeader'
import { authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import ItemRepository from 'infrastructure/repositories/ItemRepository'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import AppsIcon from '@mui/icons-material/Apps'
import TableRowsIcon from '@mui/icons-material/TableRows'
import { Box, IconButton, TablePagination, Tooltip } from '@mui/material'
import TinyItemCardWithImage from 'components/TinyItemCard/TinyItemCardWithImage'
import { castToEnum } from '@dmtool/application'
import { unstable_batchedUpdates } from 'react-dom'
import ItemGrid from 'components/ItemGrid'

const useStyles = makeStyles()((theme) => ({
  root: {
    margin: '2em'
  },
  gridCard: {
    width: '15em',
    border: '2px solid #d3c7a6',
    background: theme.status.light,
    '&&': {
      fontSize: '12px',
      '&:hover': {
        '& > .stats-background': {
          backgroundBlendMode: 'multiply',
          boxShadow: '0.1rem 0 0.2rem #89857f,-0.1rem 0 0.2rem #89857f'
        },
        opacity: '0.9',
        cursor: 'pointer'
      }
    },
    '&&&': {
      img: {
        width: 'auto',
        minWidth: 'auto'
      }
    }
  }
}))

export const defaultFilters = {
  itemsPerPage: 50,
  pageNumber: 0,
  orderBy: 'name',
  order: Order.ASCENDING
}

enum ListViewMode {
  TABLE = 'table',
  GRID = 'grid'
}

const itemRepository = new ItemRepository()
const imageRepository = new ImageRepository()

const localStorageFiltersAtom = atomWithStorage<ItemSearchRequest>(
  'localFiltersAtom',
  defaultFilters,
  {
    getItem: (key, initialValue) => {
      const storedItem = JSON.parse(localStorage.getItem(key) || 'null')
      return storedItem || initialValue
    },
    setItem: (key, newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify({ ...newValue }))
      }
    },
    removeItem: (key) => {
      localStorage.removeItem(key)
    }
  },
  { getOnInit: true }
)

const localStorageViewModeAtom = atomWithStorage<`${ListViewMode}`>(
  'localItemsViewModeAtom',
  ListViewMode.TABLE,
  {
    getItem: (key, initialValue) => {
      const storedViewMode = castToEnum(localStorage.getItem(key), ListViewMode, ListViewMode.TABLE)
      return storedViewMode || initialValue
    },
    setItem: (key, newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, newValue)
      }
    },
    removeItem: (key) => {
      localStorage.removeItem(key)
    }
  },
  { getOnInit: true }
)

const getFiltersFromUrl = (searchParams: URLSearchParams): Partial<ItemSearchRequest> => {
  return _({
    itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '') || undefined,
    pageNumber: parseInt(searchParams.get('pageNumber') || '') || undefined,
    onlyMyItems: searchParams.get('onlyMyItems') ? Boolean(searchParams.get('onlyMyItems')) : undefined,
    search: searchParams.get('search') || undefined,
    order: (searchParams.get('order') as `${Order}`) || undefined,
    orderBy: searchParams.get('orderBy') || undefined,
    visibility: !_.isEmpty(searchParams.getAll('visibility'))
      ? (searchParams.getAll('visibility') as ItemSearchRequest['visibility'])
      : undefined,
    category: !_.isEmpty(searchParams.getAll('category')) ? (searchParams.getAll('category') as ItemSearchRequest['category']) : undefined,
    property: !_.isEmpty(searchParams.getAll('property')) ? (searchParams.getAll('property') as ItemSearchRequest['property']) : undefined,
    rarity: !_.isEmpty(searchParams.getAll('rarity')) ? (searchParams.getAll('rarity') as ItemSearchRequest['rarity']) : undefined,
    source: !_.isEmpty(searchParams.getAll('source')) ? (searchParams.getAll('source') as ItemSearchRequest['source']) : undefined,
    priceComparison: (searchParams.get('priceComparison') as ComparisonOption) || undefined,
    priceQuantity: searchParams.get('priceQuantity') || undefined,
    priceUnit: searchParams.get('priceUnit') || undefined,
    weightComparison: (searchParams.get('weightComparison') as ComparisonOption) || undefined,
    weight: searchParams.get('weight') || undefined,
    requiresAttunement: searchParams.get('requiresAttunement') ? searchParams.get('requiresAttunement') === 'true' : undefined,
    hasImage: searchParams.get('hasImage') ? searchParams.get('hasImage') === 'true' : undefined
  })
    .omitBy(_.isUndefined)
    .value()
}

const constructFilters = (urlFilters: Partial<ItemSearchRequest>, localStorageFilters: ItemSearchRequest): ItemSearchRequest => {
  if (!_.isEmpty(urlFilters)) {
    return {
      itemsPerPage: urlFilters.itemsPerPage || defaultFilters.itemsPerPage,
      pageNumber: urlFilters.pageNumber || defaultFilters.pageNumber,
      onlyMyItems: urlFilters.onlyMyItems || false,
      search: urlFilters.search || undefined,
      order: (urlFilters.order as `${Order}`) || defaultFilters.order,
      orderBy: urlFilters.orderBy || defaultFilters.orderBy,
      visibility: (urlFilters.visibility as ItemSearchRequest['visibility']) || [],
      category: (urlFilters.category as ItemSearchRequest['category']) || [],
      property: (urlFilters.property as ItemSearchRequest['property']) || [],
      rarity: (urlFilters.rarity as ItemSearchRequest['rarity']) || [],
      source: (urlFilters.source as ItemSearchRequest['source']) || [],
      priceComparison: (urlFilters.priceComparison as ComparisonOption) || ComparisonOption.EXACTLY,
      priceQuantity: urlFilters.priceQuantity || undefined,
      priceUnit: urlFilters.priceUnit || '',
      weightComparison: (urlFilters.weightComparison as ComparisonOption) || ComparisonOption.EXACTLY,
      weight: urlFilters.weight || undefined,
      requiresAttunement: urlFilters.requiresAttunement !== undefined ? urlFilters.requiresAttunement : null,
      hasImage: urlFilters.hasImage !== undefined ? urlFilters.hasImage : null
    }
  } else {
    return localStorageFilters
  }
}

const convertFiltersToUrlSearchParams = (itemTableFilters: ItemSearchRequest, loggedIn: boolean) => {
  return {
    pageNumber: String(itemTableFilters.pageNumber || defaultFilters.pageNumber),
    itemsPerPage: String(itemTableFilters.itemsPerPage || defaultFilters.itemsPerPage),
    order: String(itemTableFilters.order || defaultFilters.order),
    orderBy: String(itemTableFilters.orderBy || defaultFilters.orderBy),
    ...(loggedIn ? { onlyMyItems: String(itemTableFilters.onlyMyItems || 'false') } : {}),
    visibility: itemTableFilters.visibility || [],
    category: itemTableFilters.category || [],
    property: itemTableFilters.property || [],
    rarity: itemTableFilters.rarity || [],
    source: itemTableFilters.source || [],
    ...(itemTableFilters.search && itemTableFilters.search ? { search: itemTableFilters.search } : { search: '' }),
    ...(itemTableFilters.priceQuantity && itemTableFilters.priceComparison ? { priceComparison: itemTableFilters.priceComparison } : {}),
    ...(itemTableFilters.priceQuantity ? { priceQuantity: String(itemTableFilters.priceQuantity) } : {}),
    ...(itemTableFilters.priceQuantity && itemTableFilters.priceUnit ? { priceUnit: itemTableFilters.priceUnit || '' } : {}),
    ...(itemTableFilters.weight && itemTableFilters.weightComparison ? { weightComparison: itemTableFilters.weightComparison } : {}),
    ...(itemTableFilters.weight ? { weight: String(itemTableFilters.weight) } : {}),
    ...(itemTableFilters.requiresAttunement !== null ? { requiresAttunement: String(itemTableFilters.requiresAttunement) } : {}),
    ...(itemTableFilters.hasImage !== null ? { hasImage: String(itemTableFilters.hasImage) } : {})
  }
}

interface ListViewSelectionProps {
  onClick: (mode: `${ListViewMode}`) => void
  listViewMode: `${ListViewMode}`
  disabled?: boolean
}

const ListViewSelection: React.FC<ListViewSelectionProps> = ({ onClick, listViewMode, disabled }) => {
  const internalOnClick = (mode: `${ListViewMode}`) => () => {
    onClick(mode)
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Tooltip title="Table View" disableInteractive placement="top-end">
        <span>
          <IconButton
            sx={{ borderRadius: 0 }}
            color={listViewMode === ListViewMode.TABLE ? 'secondary' : 'default'}
            size="large"
            onClick={internalOnClick('table')}
            disabled={disabled}
          >
            <TableRowsIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Grid View" disableInteractive placement="top-end">
        <span>
          <IconButton
            sx={{ borderRadius: 0 }}
            color={listViewMode === ListViewMode.GRID ? 'secondary' : 'default'}
            size="large"
            onClick={internalOnClick('grid')}
            disabled={disabled}
          >
            <AppsIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}

const ItemsPage: React.FC = () => {
  const navigate = useNavigate()
  const { classes } = useStyles()

  const fetchItemsControllerRef = useRef<AbortController | null>(null)

  const [localStorageFilters, setLocalStorageFilters] = useAtom(localStorageFiltersAtom)
  const [localStorageViewMode, setLocalStorageViewMode] = useAtom(localStorageViewModeAtom)

  const [itemList, setItemList] = useState<ItemDTO[]>([])
  const [listViewMode, setListViewMode] = useState<`${ListViewMode}`>(localStorageViewMode)
  const [loadingItemList, setLoadingItemList] = useState(false)
  let [searchParams, setSearchParams] = useSearchParams()

  const urlFilters = getFiltersFromUrl(searchParams)

  const [itemTableFilters, setItemTableFilters] = useState<ItemSearchRequest>(constructFilters(urlFilters, localStorageFilters))
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
    setSearchParams(convertFiltersToUrlSearchParams(itemTableFilters, authState.loggedIn))
    setLocalStorageFilters(itemTableFilters)
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

  const onChangeMode = (mode: `${ListViewMode}`) => {
    unstable_batchedUpdates(() => {
      setListViewMode(mode)
      setLocalStorageViewMode(mode)
    })
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: (typeof ItemSortableKeys)[number]) => {
    const isAsc = itemTableFilters.orderBy === property && itemTableFilters.order === 'asc'
    setItemTableFilters({ ...defaultFilters, ...itemTableFilters, order: isAsc ? Order.DESCENDING : Order.ASCENDING, orderBy: property })
  }

  const goToItem = (itemId?: string) => {
    if (itemId) {
      navigate(`/card/item/${itemId}`, { replace: true })
    }
  }

  return (
    <div className={classes.root}>
      <PageHeader>Items</PageHeader>
      <ItemTableFilters onSearch={onSearch} filters={itemTableFilters} setFilters={setItemTableFilters} loading={loadingItemList} />
      <ListViewSelection onClick={onChangeMode} listViewMode={listViewMode} disabled={loadingItemList} />
      {listViewMode === ListViewMode.TABLE ? (
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
      ) : (
        <ItemGrid
          items={itemList}
          totalCount={totalCount}
          pageNumber={itemTableFilters.pageNumber && totalCount > 0 ? itemTableFilters.pageNumber : defaultFilters.pageNumber}
          itemsPerPage={itemTableFilters.itemsPerPage || defaultFilters.itemsPerPage}
          loading={loadingItemList}
          setItemTableFilters={setItemTableFilters}
          goToItem={goToItem}
        />
      )}
    </div>
  )
}

export default ItemsPage
