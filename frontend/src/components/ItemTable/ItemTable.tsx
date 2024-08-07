import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import React, { useEffect, useRef, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ItemCard from 'components/ItemCard'
import { useOrientation } from 'utils/hooks'
import { useNavigate } from 'react-router-dom'
import { HttpImageRepositoryInterface, ITEM_DEFAULTS, ItemDTO, ItemSearchRequest } from '@dmtool/application'
import { useAtom } from 'jotai'
import { AuthState, authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import _ from 'lodash'
import useImage from 'hooks/useImage'
import DeleteButton from 'components/DeleteButton'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { FrontendItemRepositoryInterface } from 'infrastructure/repositories/ItemRepository'
import { Source, Visibility } from '@dmtool/domain'
import config from 'config'
import { yellow } from '@mui/material/colors'

import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import { Order, uuid } from '@dmtool/common'
import { ItemSortableKeys } from '@dmtool/domain'
import { highlightTextPart } from 'utils/utils'
import { TablePaginationActions } from './TablePaginationActions'

const useStyles = makeStyles()(() => ({
  root: {
    '& .highlight': {
      backgroundColor: yellow['A200']
    }
  },
  itemCard: {
    '&&&': {
      margin: '0'
    },
    '&.stats-container': {
      width: 'auto'
    }
  },
  fifthEItemCard: {
    maxWidth: 'fit-content'
  }
}))

const tableColumnHide = { xs: 'none', sm: 'none', md: 'none', lg: 'table-cell' }

const reverseOrder = (order: `${Order}`) => {
  return order === 'asc' ? 'desc' : 'asc'
}

const ExpandCollapseTableCell: React.FC<{ closeAll: () => void; openAll: () => void }> = ({ closeAll, openAll }) => {
  return (
    <TableCell sx={{ width: '0%', textAlign: 'right', maxWidth: '3%' }}>
      <Tooltip title="Close all" placement="top-end">
        <IconButton onClick={closeAll}>
          <CloseFullscreenIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Open all" placement="top-end">
        <IconButton onClick={openAll}>
          <OpenInFullIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  )
}

interface ItemTableProps {
  items: ItemDTO[]
  itemRepository: FrontendItemRepositoryInterface
  imageRepository: HttpImageRepositoryInterface
  setItemList: (value: React.SetStateAction<ItemDTO[]>) => void
  pageNumber: number
  itemsPerPage: number
  search?: string
  setItemTableFilters: React.Dispatch<React.SetStateAction<ItemSearchRequest>>
  order: `${Order}`
  orderBy: string
  onRequestSort: (event: React.MouseEvent<unknown>, property: (typeof ItemSortableKeys)[number]) => void
  totalCount: number
  loading: boolean
}

export const ItemTable: React.FC<ItemTableProps> = ({
  items = [],
  itemRepository,
  imageRepository,
  setItemList,
  pageNumber,
  itemsPerPage,
  search,
  setItemTableFilters,
  order,
  orderBy,
  onRequestSort,
  totalCount,
  loading
}) => {
  const [authState] = useAtom(authAtom)
  const theme = useTheme()
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'
  const [allOpen, setAllOpen] = useState(false)
  const [resetKey, setResetKey] = useState('')
  const { classes } = useStyles()

  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isMedium = useMediaQuery(theme.breakpoints.down('lg'))

  const tablePalette = theme.palette.augmentColor({
    color: {
      main: theme.palette.primary.light,
      dark: '#EBDDB9'
    }
  })

  useEffect(() => {
    document.body.style.overflowY = 'scroll'
    return () => {
      document.body.style.overflowY = ''
    }
  }, [])

  const handleChangePage = (event: unknown, newPage: number) => {
    setItemTableFilters((_itemTableFilters) => {
      return {
        ..._itemTableFilters,
        pageNumber: newPage
      }
    })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemTableFilters((_itemTableFilters) => {
      return {
        ..._itemTableFilters,
        itemsPerPage: +event.target.value,
        pageNumber: 0
      }
    })
  }

  const openAll = () => {
    setAllOpen(true)
    setResetKey(uuid())
  }

  const closeAll = () => {
    setAllOpen(false)
    setResetKey(uuid())
  }

  const createSortHandler = (property: (typeof ItemSortableKeys)[number]) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <>
      <TableContainer
        component={Paper}
        className={classes.root}
        sx={{
          borderRadius: 'unset',
          background: 'transparent',
          boxShadow: '0px 2px 0px -1px rgba(0,0,0,0.4)'
        }}
      >
        <Table
          stickyHeader
          size={totalCount > 20 || isPortrait ? 'small' : 'medium'}
          sx={{
            borderLeft: (theme) => `1px solid ${theme.palette.grey[300]}`,
            borderRight: (theme) => `1px solid ${theme.palette.grey[300]}`,
            borderCollapse: 'collapse',
            '& .MuiTableCell-root': {
              padding: '8px 8px'
            }
          }}
        >
          <TableHead
            sx={{
              '& th': {
                background: (theme) => (loading ? theme.palette.grey[200] : theme.palette.secondary.light),
                textTransform: 'capitalize',
                fontWeight: 'bold',
                fontSize: '1.3em',
                color: loading ? theme.palette.grey[400] : tablePalette.contrastText,
                whiteSpace: 'nowrap'
              }
            }}
          >
            <TableRow>
              <TableCell />
              <TableCell sortDirection={orderBy === 'name' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? reverseOrder(order) : 'desc'}
                  onClick={createSortHandler('name')}
                  sx={{
                    '&&': {
                      color: loading ? theme.palette.grey[400] : 'initial'
                    }
                  }}
                >
                  name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '8em' }}>categories</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'rarity'}
                  direction={orderBy === 'rarity' ? reverseOrder(order) : 'desc'}
                  onClick={createSortHandler('rarity')}
                >
                  rarity
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ display: isSmall ? tableColumnHide : 'table-cell', width: '0%' }}>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? reverseOrder(order) : 'desc'}
                  onClick={createSortHandler('price')}
                >
                  price
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ display: isSmall ? tableColumnHide : 'table-cell', width: '0%' }}>
                <TableSortLabel
                  active={orderBy === 'weight'}
                  direction={orderBy === 'weight' ? reverseOrder(order) : 'desc'}
                  onClick={createSortHandler('weight')}
                >
                  weight
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <TableSortLabel
                  active={orderBy === 'createdBy'}
                  direction={orderBy === 'createdBy' ? reverseOrder(order) : 'desc'}
                  onClick={createSortHandler('createdBy')}
                >
                  created by
                </TableSortLabel>
              </TableCell>
              {authState.loggedIn && (
                <TableCell sx={{ display: isPortrait ? tableColumnHide : 'table-cell', textAlign: 'center' }}>visibility</TableCell>
              )}
              <TableCell sx={{ display: isMedium ? tableColumnHide : 'table-cell', width: '0%' }}>
                <TableSortLabel
                  active={orderBy === 'source'}
                  direction={orderBy === 'source' ? reverseOrder(order) : 'desc'}
                  onClick={createSortHandler('source')}
                >
                  source
                </TableSortLabel>
              </TableCell>
              {!authState.loggedIn ? (
                <ExpandCollapseTableCell openAll={openAll} closeAll={closeAll} />
              ) : (
                <TableCell sx={{ width: '1em' }} />
              )}
              {authState.loggedIn && <ExpandCollapseTableCell openAll={openAll} closeAll={closeAll} />}
            </TableRow>
          </TableHead>
          <TableBody sx={{ opacity: loading ? '0.5' : '1', background: '#fdf4dc' }}>
            {loading ? (
              <TableRow>
                <TableCell
                  sx={{ width: '0%', minWidth: '2em' }}
                  colSpan={authState.loggedIn ? LOGGED_IN_TABLE_COLUMN_COUNT - 6 : LOGGED_IN_TABLE_COLUMN_COUNT - 7}
                >
                  {Array.from(Array(4).keys()).map((index) => {
                    return (
                      <Skeleton
                        key={index}
                        variant="rounded"
                        width="100%"
                        height={40}
                        animation="wave"
                        sx={{ margin: '0 0 0.5em 0', backgroundColor: 'rgba(0, 0, 0, 0.21)' }}
                      />
                    )
                  })}
                </TableCell>
              </TableRow>
            ) : items && items.length > 0 ? (
              items.map((item, index) => {
                return (
                  <TableItemRow
                    key={`${item.id}-${index}-${resetKey}`}
                    item={item}
                    search={search}
                    itemRepository={itemRepository}
                    imageRepository={imageRepository}
                    setItemList={setItemList}
                    authState={authState}
                    open={allOpen}
                    sx={
                      index % 2 === 0
                        ? {
                            // even rows
                            background: tablePalette.light
                          }
                        : {
                            background: tablePalette.dark
                          }
                    }
                  />
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={authState.loggedIn ? LOGGED_IN_TABLE_COLUMN_COUNT : LOGGED_IN_TABLE_COLUMN_COUNT - 1}
                  sx={{ padding: '10em', textAlign: 'center' }}
                >
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter sx={{ opacity: loading ? '0.5' : '1', borderTop: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
            <TableRow sx={{ background: '#F3EBD6' }}>
              <TablePagination
                labelRowsPerPage="Items per page"
                disabled={loading}
                rowsPerPageOptions={[2, 10, 25, 50, 75, 100, 200]}
                count={totalCount}
                colSpan={LOGGED_IN_TABLE_COLUMN_COUNT}
                rowsPerPage={itemsPerPage}
                page={pageNumber}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}

interface TableItemRowProps {
  item: ItemDTO
  search?: string
  open?: boolean
  sx?: SxProps<Theme>
  itemRepository: FrontendItemRepositoryInterface
  imageRepository: HttpImageRepositoryInterface
  authState: AuthState
  setItemList: (value: React.SetStateAction<ItemDTO[]>) => void
}

const LOGGED_IN_TABLE_COLUMN_COUNT = 11

const TableItemRow: React.FC<TableItemRowProps> = ({
  item,
  search,
  open: externalOpen,
  itemRepository,
  imageRepository,
  authState,
  setItemList,
  sx = {}
}) => {
  const [localItem, setLocalItem] = useState(item)
  const [open, setOpen] = useState(externalOpen || false)
  const [loadingItem, setLoadingItem] = useState(false)
  const [imageId, setImageId] = useState<string | null>(null)
  const [{ image, loading: loadingImage }] = useImage(imageRepository, imageId)
  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const navigate = useNavigate()
  const { classes } = useStyles()
  const [areYouSureToDeleteDialogOpen, setAreYouSureToDeleteDialogOpen] = useState<boolean>(false)

  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isMedium = useMediaQuery(theme.breakpoints.down('lg'))
  const isLarge = useMediaQuery(theme.breakpoints.down('xl'))

  const itemCardPadding = isLarge ? '5%' : '20%'

  const itemRequestControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setLocalItem(item)
  }, [item])

  useEffect(() => {
    setImageId(localItem.imageId)
  }, [localItem])

  useEffect(() => {
    if (externalOpen !== open) {
      setOpen(externalOpen || false)
    }
  }, [externalOpen])

  useEffect(() => {
    const getItem = async (_id: string, _source: `${Source}`) => {
      setLoadingItem(true)
      const controller = new AbortController()
      itemRequestControllerRef.current = controller
      try {
        const fifthEditionItem = await itemRepository.getByIdAndSource(_id, _source, { signal: controller.signal })
        // this if is to prevent setting the default item as the item on the row
        if (fifthEditionItem.id === _id) {
          setLocalItem(new ItemDTO(fifthEditionItem))
        }
        setLoadingItem(false)
      } catch {
        setLoadingItem(false)
      }
    }

    if (open) {
      getItem(localItem.id, localItem.source)
    }
  }, [open])

  useEffect(() => {
    return () => {
      itemRequestControllerRef?.current?.abort(`item ${item.id} row unmounted`)
    }
  }, [])

  const redirectToItemStats = () => {
    navigate(`${config.cardPageRoot}/item/${localItem.id}`)
  }

  const onDelete = () => {
    setAreYouSureToDeleteDialogOpen(true)
  }

  const closeAreYouSureToDeleteDialog = (confirmDeleteItem?: boolean) => {
    if (confirmDeleteItem) {
      deleteItem()
    }
    setAreYouSureToDeleteDialogOpen(false)
  }

  const deleteItem = () => {
    if (authState.loggedIn && authState.user && localItem) {
      itemRepository
        .delete(localItem.id)
        .then((deletedItem) => {
          setItemList((_itemList) => {
            return _.filter(_itemList, (_item) => _item.id !== deletedItem.id)
          })
        })
        .catch((error) => {
          setError(error)
        })
    }
  }

  return (
    <React.Fragment>
      <TableRow
        className="row"
        sx={{
          ...sx,
          ...{
            '& > *': { width: '4%', borderBottom: 'unset', whiteSpace: 'nowrap' },
            cursor: 'pointer',
            '&:hover': {
              background: (theme) => theme.palette.primary.dark
            }
          }
        }}
      >
        <TableCell onClick={() => setOpen(!open)} sx={{ width: '0%', maxWidth: '2em' }}>
          <IconButton size="small">{open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}</IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ '&&': { whiteSpace: 'normal' }, width: '0%', minWidth: '6em', textTransform: 'capitalize' }}
          onClick={() => setOpen(!open)}
          dangerouslySetInnerHTML={{ __html: highlightTextPart(localItem.name, search) || localItem.name }}
        />
        <TableCell
          component="th"
          scope="row"
          sx={{ '&&': { whiteSpace: 'normal' }, width: '0%', minWidth: '8em', textTransform: 'capitalize' }}
          onClick={() => setOpen(!open)}
        >
          {localItem.all_categories_label}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ width: '0%', textTransform: 'capitalize' }}>
          {localItem.rarity_label}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ display: isSmall ? tableColumnHide : 'table-cell', width: '0%' }}>
          {localItem.price_label}
        </TableCell>
        <TableCell
          onClick={() => setOpen(!open)}
          sx={{ display: isSmall ? tableColumnHide : 'table-cell', width: '0%', textAlign: 'center' }}
        >
          {localItem.weight ? `${localItem.weight} lb.` : ''}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ textAlign: 'center', width: '0%' }}>
          {authState.user?.id === localItem.createdBy ? (
            <strong>{localItem.getCreatedByUserName(authState.user?.id)}</strong>
          ) : (
            localItem.createdByUserName
          )}
        </TableCell>
        {authState.loggedIn && (
          <TableCell
            onClick={() => setOpen(!open)}
            sx={{ display: isPortrait ? tableColumnHide : 'table-cell', textAlign: 'center', width: '0%' }}
          >
            <Chip
              label={localItem.visibility_label}
              sx={{ fontWeight: 'bold' }}
              color={
                localItem.visibility === Visibility.PUBLIC
                  ? 'success'
                  : localItem.visibility === Visibility.LOGGED_IN
                  ? 'warning'
                  : localItem.visibility === Visibility.PRIVATE
                  ? 'error'
                  : 'default'
              }
            />
          </TableCell>
        )}
        <TableCell onClick={() => setOpen(!open)} sx={{ display: isMedium ? tableColumnHide : 'table-cell', width: '0%' }}>
          {localItem.getSource(authState.user?.id)}
        </TableCell>
        <TableCell sx={{ width: '0%', textAlign: authState.loggedIn ? 'center' : 'end' }}>
          <Tooltip
            PopperProps={{
              sx: {
                '.MuiTooltip-tooltip': {
                  padding: 0,
                  boxShadow: (theme) => theme.shadows[5]
                }
              }
            }}
            disableInteractive
            title={
              <Alert severity="error">
                WARNING! Overwrites any changes in item card editor. {authState.loggedIn ? 'Remember to save it first.' : ''}
              </Alert>
            }
            placement="top-end"
          >
            <Button variant="contained" onClick={redirectToItemStats}>
              Edit
            </Button>
          </Tooltip>
        </TableCell>
        {authState.loggedIn && (
          <TableCell
            sx={{ width: '0%', textAlign: 'end', maxWidth: '3%' }}
            onClick={
              localItem?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || localItem?.id === 'newItem' || localItem.createdBy !== authState.user?.id
                ? () => setOpen(!open)
                : undefined
            }
          >
            <Tooltip
              title={
                localItem?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || localItem?.id === 'newItem' || localItem.createdBy !== authState.user?.id
                  ? ''
                  : 'Delete item'
              }
              placement="top-end"
            >
              <div>
                <DeleteButton
                  onClick={onDelete}
                  Icon={DeleteForeverIcon}
                  disabled={
                    localItem?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ||
                    localItem?.id === 'newItem' ||
                    localItem.createdBy !== authState.user?.id
                  }
                />
              </div>
            </Tooltip>
            <Dialog
              open={areYouSureToDeleteDialogOpen}
              onClose={() => closeAreYouSureToDeleteDialog()}
              PaperProps={{ sx: { padding: '0.5em' } }}
            >
              <DialogTitle id={`are-you-sure-to-delete`} sx={{ fontWeight: 'bold' }}>{`Are you sure`}</DialogTitle>
              <DialogContent>
                <Typography variant="body2" paragraph={false}>
                  Are you sure you want to delete <strong>{localItem?.name}</strong>
                </Typography>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginRight: '6em' }}>
                  <Button variant="outlined" color="secondary" onClick={() => closeAreYouSureToDeleteDialog()}>
                    Cancel
                  </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '0.5em' }}>
                  <Button variant="outlined" color="error" onClick={() => closeAreYouSureToDeleteDialog(true)}>
                    Yes, delete
                  </Button>
                </div>
              </DialogActions>
            </Dialog>
          </TableCell>
        )}
      </TableRow>
      <TableRow className="collapsible">
        <TableCell style={{ padding: 0 }} colSpan={authState.loggedIn ? LOGGED_IN_TABLE_COLUMN_COUNT : LOGGED_IN_TABLE_COLUMN_COUNT - 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                display: 'flex',
                margin: 3,
                maxWidth: '90%',
                paddingRight: isPortrait ? '' : itemCardPadding,
                '& .stats-container': {
                  margin: 0
                }
              }}
            >
              {loadingItem ? (
                <Skeleton variant="rounded" width="100%" height={60} animation="wave" />
              ) : (
                <ItemCard
                  item={localItem}
                  image={image}
                  loadingImage={loadingImage}
                  className={`${classes.itemCard}${item.source === Source.FifthESRD ? ` ${classes.fifthEItemCard}` : ''}`}
                  highlightText={search}
                />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default React.memo(ItemTable)
