import { ItemDTO, ItemSearchRequest } from '@dmtool/application'
import { Box, Skeleton, TablePagination } from '@mui/material'
import { TablePaginationActions } from 'components/ItemTable/TablePaginationActions'
import TinyItemCardWithImage from 'components/TinyItemCard/TinyItemCardWithImage'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
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

interface ItemGridProps {
  items: ItemDTO[]
  loading: boolean
  totalCount: number
  pageNumber: number
  itemsPerPage: number
  setItemTableFilters: React.Dispatch<React.SetStateAction<ItemSearchRequest>>
  goToItem: (itemId?: string) => void
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  loading,
  totalCount,
  pageNumber,
  itemsPerPage,
  setItemTableFilters,
  goToItem
}) => {
  const { classes } = useStyles()

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

  return (
    <Box>
      <Box
        sx={{
          margin: '0 0 0 0',
          display: 'grid',
          gridTemplateColumns: `repeat(${loading ? '6, 0fr' : 'auto-fill, minmax(180px, 1fr)'})`,
          gap: '1em',
          padding: '1em',
          background: 'rgba(245, 245, 245, 0.7)',
          border: '2px solid #d3c7a6'
        }}
      >
        {loading
          ? Array.from(Array(6).keys()).map((index) => {
              return (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={120}
                  height={120}
                  animation="wave"
                  sx={{ margin: '0 0 0.5em 0', backgroundColor: 'rgba(0, 0, 0, 0.21)', opacity: 1.0 - index * 0.2 }}
                />
              )
            })
          : items.map((item, index) => {
              return (
                <div key={`${item.id}-${index}`} onClick={() => goToItem(item.id)}>
                  <TinyItemCardWithImage item={item} className={classes.gridCard} />
                </div>
              )
            })}
      </Box>
      <TablePagination
        component="div"
        labelRowsPerPage="Items per page"
        disabled={loading}
        rowsPerPageOptions={[2, 10, 25, 50, 75, 100, 200]}
        count={totalCount}
        rowsPerPage={itemsPerPage}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </Box>
  )
}

export default ItemGrid
