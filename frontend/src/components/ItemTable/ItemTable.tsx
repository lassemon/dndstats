import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ItemCard from 'components/ItemCard'
import { useOrientation } from 'utils/hooks'
import { useNavigate } from 'react-router-dom'
import { HttpImageRepositoryInterface, ITEM_DEFAULTS, ItemDTO, ItemSearchRequest } from '@dmtool/application'
import { useAtom } from 'jotai'
import { AuthState, authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import _, { capitalize } from 'lodash'
import useImage from 'hooks/useImage'
import DeleteButton from 'components/DeleteButton'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { FrontendItemRepositoryInterface } from 'infrastructure/repositories/ItemRepository'
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions'
import LoadingIndicator from 'components/LoadingIndicator'
import { ComparisonOption, ItemRarity, PriceUnit, Source, Visibility } from '@dmtool/domain'
import { AutoCompleteItem } from 'components/Autocomplete/AutocompleteItem'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { LoadingButton } from '@mui/lab'
import config from 'config'

const useStyles = makeStyles()(() => ({
  itemCard: {
    '&&&': {
      margin: '0'
    },
    '&.stats-container': {
      width: 'auto'
    }
  }
}))

interface TableFiltersProps {
  onSearch: () => void
  filters: ItemSearchRequest
  setFilters: React.Dispatch<React.SetStateAction<ItemSearchRequest>>
}

const TableFilters: React.FC<TableFiltersProps> = ({ onSearch, filters, setFilters }) => {
  const [rarityFilter, setRarityFilter] = useState<ItemSearchRequest['rarity']>(filters.rarity || [])
  const [visibilityFilter, setVisibilityFilter] = useState<ItemSearchRequest['visibility']>(filters.visibility || [])
  const [sourceFilter, setSourceFilter] = useState<ItemSearchRequest['source']>(filters.source)
  const [searchFilter, setSearchFilter] = useState('')
  const [priceComparison, setPriceComparison] = useState<string>(filters.priceComparison || 'exactly')
  const [priceQuantity, setPriceQuantity] = useState(filters.priceQuantity ? String(filters.priceQuantity) : '')
  const [priceUnit, setPriceUnit] = useState(filters.priceUnit ? String(filters.priceUnit) : 'gp')
  const [weightComparison, setWeightComparison] = useState<string>(filters.weightComparison || 'exactly')
  const [weightFilter, setWeightFilter] = useState(filters.weight ? String(filters.weight) : '')
  const [authState] = useAtom(authAtom)

  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const onEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13) {
      console.log('pressed enter')
    }
  }

  const onClearPrice = () => {
    setPriceQuantity('')
  }

  const onClearWeight = () => {
    setWeightFilter('')
  }

  const onClearSearch = () => {
    setSearchFilter('')
  }

  useEffect(() => {
    setFilters((_filters) => {
      return {
        ..._filters,
        visibility: visibilityFilter,
        rarity: rarityFilter,
        source: sourceFilter,
        priceComparison: priceComparison as `${ComparisonOption}`,
        priceQuantity: priceQuantity ? parseInt(priceQuantity) : undefined,
        priceUnit: priceUnit,
        weightComparison: weightComparison as `${ComparisonOption}`,
        weight: weightFilter ? parseInt(weightFilter) : undefined
      }
    })
  }, [visibilityFilter, rarityFilter, sourceFilter, priceComparison, priceQuantity, priceUnit, weightComparison, weightFilter])

  const filterItemMinWidth = '14em'

  return (
    <Paper
      sx={{
        width: '100%',
        background: (theme) => theme.palette.primary.main,
        margin: '1em 0 2em 0',
        padding: '1em',
        borderRadius: '0.6em',
        zIndex: '100',
        boxSizing: 'border-box',
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '1em'
      }}
    >
      <Typography variant="h5">Filters</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          flexWrap: 'wrap',
          '& > *': {
            flex: isSmall ? '1 1 100%' : '0 1 32%'
          },
          gap: '1em'
        }}
      >
        <Autocomplete
          multiple
          clearOnBlur
          disableCloseOnSelect
          size="small"
          id="rarity-filter"
          options={Object.values(ItemRarity).map((rarity) => rarity.toString().toLowerCase())}
          getOptionLabel={(option) => option.replaceAll('_', ' ')}
          onChange={(_, newFilters) => {
            setRarityFilter(newFilters as ItemSearchRequest['rarity'])
          }}
          value={rarityFilter}
          PaperComponent={AutoCompleteItem}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Rarity"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
        />
        {authState.loggedIn && (
          <Autocomplete
            multiple
            clearOnBlur
            disableCloseOnSelect
            size="small"
            id="visibility-filter"
            options={Object.values(Visibility).map((visibility) => visibility.toString().toLowerCase())}
            getOptionLabel={(option) => option.replaceAll('_', ' ')}
            onChange={(_, newFilters) => setVisibilityFilter(newFilters as ItemSearchRequest['visibility'])}
            value={visibilityFilter}
            PaperComponent={AutoCompleteItem}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Visibility"
                size="small"
                InputLabelProps={{
                  shrink: true
                }}
              />
            )}
          />
        )}
        <Autocomplete
          multiple
          clearOnBlur
          disableCloseOnSelect
          size="small"
          id="source-filter"
          options={_.without(Object.values(Source), Source.MyItem).map((source) => source.toString().toLowerCase())}
          getOptionLabel={(option) => option.replaceAll('_', ' ')}
          onChange={(_, newFilters) => setSourceFilter(newFilters as ItemSearchRequest['source'])}
          value={sourceFilter}
          PaperComponent={AutoCompleteItem}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Source"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          '&& > *': {
            flex: isSmall ? '1 1 100%' : '0 1 32%',
            minWidth: filterItemMinWidth
          },
          gap: '1em'
        }}
      >
        <Box sx={{ display: 'flex', gap: '0.5em', justifyContent: 'end' }}>
          <div>
            <Select size="small" value={priceComparison} onChange={(event) => setPriceComparison(event.target.value)} sx={{ width: '6em' }}>
              {Object.values(ComparisonOption).map((comparisonOption) => {
                return (
                  <MenuItem key={comparisonOption} value={comparisonOption} sx={{ textTransform: 'lowercase' }}>
                    {capitalize(comparisonOption)}
                  </MenuItem>
                )
              })}
            </Select>
          </div>
          <TextField
            id={'price-filter'}
            value={priceQuantity}
            label={'Price'}
            type="number"
            size="small"
            onChange={(event) => setPriceQuantity(event.target.value)}
            onKeyDown={onEnter}
            variant="outlined"
            onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
              event.target.select()
            }}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={onClearPrice} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: '12em' }}
          />

          <div>
            <Select
              size="small"
              value={priceUnit}
              onChange={(event) => setPriceUnit(event.target.value)}
              sx={{ '&& .MuiSelect-select': { width: '1.5em', textTransform: 'lowercase' } }}
            >
              {Object.values(PriceUnit).map((priceUnit) => {
                return (
                  <MenuItem key={priceUnit} value={priceUnit} sx={{ textTransform: 'lowercase' }}>
                    {priceUnit}
                  </MenuItem>
                )
              })}
            </Select>
          </div>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5em', justifyContent: 'end' }}>
          <div>
            <Select
              size="small"
              value={weightComparison}
              onChange={(event) => setWeightComparison(event.target.value)}
              sx={{ width: '6em' }}
            >
              {Object.values(ComparisonOption).map((comparisonOption) => {
                return (
                  <MenuItem key={comparisonOption} value={comparisonOption} sx={{ textTransform: 'lowercase' }}>
                    {capitalize(comparisonOption)}
                  </MenuItem>
                )
              })}
            </Select>
          </div>
          <TextField
            id={'weight-filter'}
            value={weightFilter}
            label={'Weight'}
            type="number"
            size="small"
            onChange={(event) => setWeightFilter(event.target.value)}
            onKeyDown={onEnter}
            variant="outlined"
            onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
              event.target.select()
            }}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <IconButton onClick={onClearWeight} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                  <InputAdornment position="end">lb.</InputAdornment>
                </>
              )
            }}
            sx={{ width: '10em' }}
          />
        </Box>
      </Box>
      {/*<Box
        sx={{
          display: 'flex',
          gap: '1em'
        }}
      >

        <TextField
          id={'search-filter'}
          value={searchFilter}
          label={'Word Search'}
          size="small"
          onChange={(event) => setSearchFilter(event.target.value)}
          onKeyDown={onEnter}
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={onClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ width: 'max-content' }}
        />
      </Box>*/}
      <Box
        sx={{
          display: 'flex',
          '& > *': {
            flex: '1 1 100%'
          },
          gap: '1em'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', '&&': { flex: '1 1 100%' } }}>
          <LoadingButton variant="contained" color="secondary" endIcon={<SearchIcon />} onClick={onSearch}>
            Search
          </LoadingButton>
        </Box>
      </Box>
    </Paper>
  )
}

const tableColumnHide = { xs: 'none', sm: 'none', md: 'none', lg: 'table-cell' }

interface ItemTableProps {
  items: ItemDTO[]
  itemRepository: FrontendItemRepositoryInterface
  imageRepository: HttpImageRepositoryInterface
  setItemList: (value: React.SetStateAction<ItemDTO[]>) => void
  itemTableFilters: ItemSearchRequest
  onSearch: () => void
  setItemTableFilters: React.Dispatch<React.SetStateAction<ItemSearchRequest>>
  totalCount: number
  loading: boolean
}

export const ItemTable: React.FC<ItemTableProps> = ({
  items = [],
  itemRepository,
  imageRepository,
  setItemList,
  itemTableFilters,
  onSearch,
  setItemTableFilters,
  totalCount,
  loading
}) => {
  const { pageNumber = 0, itemsPerPage = 10, onlyMyItems = false } = itemTableFilters
  const [authState] = useAtom(authAtom)
  const theme = useTheme()
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

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

  const onToggleOnlyMyItems = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setItemTableFilters((_itemTableFilters) => {
      return {
        ..._itemTableFilters,
        onlyMyItems: checked
      }
    })
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 'unset',
          background: 'transparent',
          boxShadow: '0px 2px 0px -1px rgba(0,0,0,0.4)'
        }}
      >
        <TableFilters onSearch={onSearch} filters={itemTableFilters} setFilters={setItemTableFilters} />
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
                background: (theme) => theme.palette.secondary.light,
                textTransform: 'capitalize',
                fontWeight: 'bold',
                fontSize: '1.3em',
                color: tablePalette.contrastText,
                whiteSpace: 'nowrap'
              }
            }}
          >
            <TableRow>
              <TableCell />
              <TableCell>name</TableCell>
              <TableCell sx={{ '&&': { whiteSpace: 'nowrap' } }}>short description</TableCell>
              <TableCell>rarity</TableCell>
              <TableCell sx={{ display: isSmall ? tableColumnHide : 'table-cell' }}>price</TableCell>
              <TableCell sx={{ display: isSmall ? tableColumnHide : 'table-cell' }}>weight</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>created by</TableCell>
              {authState.loggedIn && (
                <TableCell sx={{ display: isPortrait ? tableColumnHide : 'table-cell', textAlign: 'center' }}>visibility</TableCell>
              )}
              <TableCell sx={{ display: isMedium ? tableColumnHide : 'table-cell', width: '0%' }}>source</TableCell>
              <TableCell sx={{ width: '0%' }} />
              {authState.loggedIn && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody sx={{ opacity: loading ? '0.5' : '1' }}>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={authState.loggedIn ? LOGGED_IN_TABLE_COLUMN_COUNT : LOGGED_IN_TABLE_COLUMN_COUNT - 1}
                  sx={{ padding: '10em', textAlign: 'center' }}
                >
                  <LoadingIndicator size={100} />
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                return (
                  <TableItemRow
                    key={index}
                    item={item}
                    itemRepository={itemRepository}
                    imageRepository={imageRepository}
                    setItemList={setItemList}
                    authState={authState}
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
            )}
          </TableBody>
          <TableFooter sx={{ opacity: loading ? '0.5' : '1', borderTop: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
            <TableRow sx={{ background: '#F3EBD6' }}>
              <TableCell colSpan={authState.loggedIn ? LOGGED_IN_TABLE_COLUMN_COUNT - 8 : LOGGED_IN_TABLE_COLUMN_COUNT - 9}>
                {authState.loggedIn && (
                  <FormGroup sx={{ alignItems: 'flex-start' }}>
                    <FormControlLabel
                      sx={{ marginRight: 0, whiteSpace: 'nowrap' }}
                      control={<Checkbox disabled={loading} color="secondary" checked={onlyMyItems} onChange={onToggleOnlyMyItems} />}
                      label="Show only my items"
                    />
                  </FormGroup>
                )}
              </TableCell>
              <TablePagination
                labelRowsPerPage="Items per page"
                disabled={loading}
                rowsPerPageOptions={[2, 10, 25, 50, 75, 100]}
                count={totalCount}
                colSpan={authState.loggedIn ? LOGGED_IN_TABLE_COLUMN_COUNT - 2 : LOGGED_IN_TABLE_COLUMN_COUNT - 3}
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
  sx?: SxProps<Theme>
  itemRepository: FrontendItemRepositoryInterface
  imageRepository: HttpImageRepositoryInterface
  authState: AuthState
  setItemList: (value: React.SetStateAction<ItemDTO[]>) => void
}

const LOGGED_IN_TABLE_COLUMN_COUNT = 11

const TableItemRow: React.FC<TableItemRowProps> = ({ item, itemRepository, imageRepository, authState, setItemList, sx = {} }) => {
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    if (open && item.imageId) {
      setImageId(item.imageId)
    }
  }, [open])

  const redirectToItemStats = () => {
    navigate(`${config.cardPageRoot}/item/${item.id}`)
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
    if (authState.loggedIn && authState.user && item) {
      itemRepository
        .delete(item.id)
        .then((deletedItem) => {
          setItemList((_itemList) => {
            return _.filter(_itemList, (item) => item.id !== deletedItem.id)
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
        <TableCell sx={{ width: '0%' }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap', width: '0%' }} onClick={() => setOpen(!open)}>
          {item.name}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'wrap', width: '0%' }} onClick={() => setOpen(!open)}>
          {item.shortDescription}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ width: '0%' }}>
          {item.rarity}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ display: isSmall ? tableColumnHide : 'table-cell', width: '0%' }}>
          {item.price_label}
        </TableCell>
        <TableCell
          onClick={() => setOpen(!open)}
          sx={{ display: isSmall ? tableColumnHide : 'table-cell', width: '0%', textAlign: 'center' }}
        >
          {`${item.weight} lb.`}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ textAlign: 'center', width: '0%' }}>
          {authState.user?.id === item.createdBy ? <strong>{item.createdByUserName}</strong> : item.createdByUserName}
        </TableCell>
        {authState.loggedIn && (
          <TableCell
            onClick={() => setOpen(!open)}
            sx={{ display: isPortrait ? tableColumnHide : 'table-cell', textAlign: 'center', width: '0%' }}
          >
            <Chip
              label={item.visibility_label}
              sx={{ fontWeight: 'bold' }}
              color={
                item.visibility === Visibility.PUBLIC
                  ? 'success'
                  : item.visibility === Visibility.LOGGED_IN
                  ? 'warning'
                  : item.visibility === Visibility.PRIVATE
                  ? 'error'
                  : 'default'
              }
            />
          </TableCell>
        )}
        <TableCell onClick={() => setOpen(!open)} sx={{ display: isMedium ? tableColumnHide : 'table-cell', width: '0%' }}>
          {item.source}
        </TableCell>
        <TableCell sx={{ width: '0%' }}>
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
            sx={{ width: '0%' }}
            onClick={
              item?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || item?.id === 'newItem' || item.createdBy !== authState.user?.id
                ? () => setOpen(!open)
                : undefined
            }
          >
            <Tooltip
              title={
                item?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || item?.id === 'newItem' || item.createdBy !== authState.user?.id
                  ? ''
                  : 'Delete item'
              }
              placement="top-end"
            >
              <div>
                <DeleteButton
                  onClick={onDelete}
                  Icon={DeleteForeverIcon}
                  disabled={item?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || item?.id === 'newItem' || item.createdBy !== authState.user?.id}
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
                  Are you sure you want to delete <strong>{item?.name}</strong>
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
              <ItemCard item={item} image={image} loadingImage={loadingImage} className={classes.itemCard} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

const TablePaginationActions: React.FC<TablePaginationActionsProps> = (props) => {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

export default ItemTable
