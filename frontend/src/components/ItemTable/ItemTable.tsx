import {
  Box,
  Button,
  Collapse,
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
  useMediaQuery,
  useTheme
} from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ItemCard from 'components/ItemCard'
import useImage from 'hooks/useImage'
import { useOrientation } from 'utils/hooks'
import { useNavigate } from 'react-router-dom'
import { HttpImageRepositoryInterface, ItemDTO } from '@dmtool/application'
import { useAtom } from 'jotai'
import { AuthState, authAtom } from 'infrastructure/dataAccess/atoms'
import { capitalize } from 'lodash'

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
  imageRepository: HttpImageRepositoryInterface
}

export const ItemTable: React.FC<ItemTableProps> = ({ items = [], imageRepository }) => {
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
              <TableCell>rarity</TableCell>
              <TableCell>price</TableCell>
              <TableCell>weight</TableCell>
              <TableCell>created by</TableCell>
              {authState.loggedIn && <TableCell>visibility</TableCell>}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableItemRow
                key={index}
                item={item}
                imageRepository={imageRepository}
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
  imageRepository: HttpImageRepositoryInterface
  authState: AuthState
}

const TableItemRow: React.FC<TableItemRowProps> = ({ item, imageRepository, authState, sx = {} }) => {
  const [open, setOpen] = useState(false)
  const [imageId, setImageId] = useState<string | null>(null)
  const [{ image, loading: loadingImage }] = useImage(imageRepository, imageId)
  const navigate = useNavigate()
  const { classes } = useStyles()

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
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }}>
          {item.name}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.shortDescription}</TableCell>
        <TableCell>{item.rarity}</TableCell>
        <TableCell>{item.price}</TableCell>
        <TableCell>{item.weight}</TableCell>
        <TableCell>{item.createdBy}</TableCell>
        {authState.loggedIn && (
          <TableCell>
            {item.visibility
              .replaceAll('_', ' ')
              .split(' ')
              .map((part) => capitalize(part))
              .join(' ')}
          </TableCell>
        )}
        <TableCell>
          <Button variant="contained" onClick={redirectToItemStats}>
            Go to editor
          </Button>
        </TableCell>
      </TableRow>
      <TableRow className="collapsible">
        <TableCell style={{ padding: 0 }} colSpan={authState.loggedIn ? 9 : 8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                display: 'flex',
                justifyContent: isPortrait ? 'center' : '',
                margin: 3,
                paddingRight: isPortrait ? '' : itemCardPadding
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
