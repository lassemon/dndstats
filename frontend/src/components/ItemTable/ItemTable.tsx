import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
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
import { HttpImageRepositoryInterface, ITEM_DEFAULTS, ItemDTO } from '@dmtool/application'
import { useAtom } from 'jotai'
import { AuthState, authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import _, { capitalize } from 'lodash'
import useImage from 'hooks/useImage'
import DeleteButton from 'components/DeleteButton'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { FrontendItemRepositoryInterface } from 'infrastructure/repositories/ItemRepository'

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

interface ItemTableProps {
  items: ItemDTO[]
  itemRepository: FrontendItemRepositoryInterface
  imageRepository: HttpImageRepositoryInterface
  setItemList: (value: React.SetStateAction<ItemDTO[]>) => void
}

const tableColumnHide = { xs: 'none', sm: 'none', md: 'none', lg: 'table-cell' }

export const ItemTable: React.FC<ItemTableProps> = ({ items = [], itemRepository, imageRepository, setItemList }) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [authState] = useAtom(authAtom)
  const theme = useTheme()
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
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          margin: '2em 0 0 0',
          borderRadius: 'unset',
          background: (theme) => theme.palette.primary.main
        }}
      >
        <Table stickyHeader>
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
              <TableCell>short description</TableCell>
              <TableCell sx={{ display: tableColumnHide }}>rarity</TableCell>
              <TableCell sx={{ display: tableColumnHide }}>price</TableCell>
              <TableCell sx={{ display: tableColumnHide }}>weight</TableCell>
              <TableCell>created by</TableCell>
              {authState.loggedIn && <TableCell sx={{ display: tableColumnHide }}>visibility</TableCell>}
              <TableCell />
              {authState.loggedIn && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableItemRow
                key={index}
                item={item}
                itemRepository={itemRepository}
                imageRepository={imageRepository}
                setItemList={setItemList}
                authState={authState}
                sx={
                  index % 2 == 0
                    ? {
                        // even rows
                        background: tablePalette.light
                      }
                    : {
                        background: tablePalette.dark
                      }
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
  const isLarge = useMediaQuery(theme.breakpoints.down('xl'))

  const itemCardPadding = isLarge ? '5%' : '20%'

  useEffect(() => {
    if (open && item.imageId) {
      setImageId(item.imageId)
    }
  }, [open])

  const redirectToItemStats = () => {
    navigate(`/stats/item/${item.id}`)
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
            '& > *': { borderBottom: 'unset', whiteSpace: 'nowrap' },
            cursor: 'pointer',
            '&:hover': {
              background: (theme) => theme.palette.primary.dark
            }
          }
        }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }} onClick={() => setOpen(!open)}>
          {item.name}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={() => setOpen(!open)}>
          {item.shortDescription}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ display: tableColumnHide }}>
          {item.rarity}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ display: tableColumnHide }}>
          {item.price}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ display: tableColumnHide }}>
          {item.weight}
        </TableCell>
        <TableCell onClick={() => setOpen(!open)}>{item.createdByUserName}</TableCell>
        {authState.loggedIn && (
          <TableCell onClick={() => setOpen(!open)} sx={{ display: tableColumnHide }}>
            {item.visibility
              .replaceAll('_', ' ')
              .split(' ')
              .map((part) => capitalize(part))
              .join(' ')}
          </TableCell>
        )}
        <TableCell>
          <Tooltip
            PopperProps={{
              sx: {
                '.MuiTooltip-tooltip': {
                  padding: 0,
                  boxShadow: (theme) => theme.shadows[5]
                }
              }
            }}
            title={
              <Alert severity="error">
                WARNING! Overwrites the current item in stats editor. {authState.loggedIn ? 'Remember to save it first.' : ''}
              </Alert>
            }
            placement="top-end"
          >
            <Button variant="contained" onClick={redirectToItemStats}>
              Open In Editor
            </Button>
          </Tooltip>
        </TableCell>
        {authState.loggedIn && (
          <TableCell>
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
        <TableCell style={{ padding: 0 }} colSpan={authState.loggedIn ? 10 : 9}>
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

export default ItemTable
