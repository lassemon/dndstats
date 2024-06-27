import { ItemDTO } from '@dmtool/application'
import { Box, Skeleton } from '@mui/material'
import PageHeader from 'components/PageHeader'
import TinyItemCardWithImage from 'components/TinyItemCard/TinyItemCardWithImage'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import ItemRepository from 'infrastructure/repositories/ItemRepository'
import { useAtom } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  myItemCard: {
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

const itemRepository = new ItemRepository()

const MyItemsPage: React.FC = () => {
  const [loadingMyItems, setLoadingMyItems] = useState(true)
  const [myItems, setMyItems] = useState<ItemDTO[]>([])
  const [authState] = useAtom(authAtom)
  const navigate = useNavigate()
  const { classes } = useStyles()

  const myItemsRequestControllerRef = useRef<AbortController | null>(null)

  const goToItem = (itemId?: string) => {
    if (itemId) {
      navigate(`/card/item/${itemId}`, { replace: true })
    }
  }

  useEffect(() => {
    if (!authState.loggedIn) {
      navigate(`/`)
    } else {
      const fetchAndSetPageStats = async () => {
        try {
          setLoadingMyItems(true)
          const controller = new AbortController()
          myItemsRequestControllerRef.current = controller

          const myItemsResponse = await itemRepository.getAllForUser({ signal: controller.signal }).finally(() => {
            setLoadingMyItems(false)
          })
          unstable_batchedUpdates(() => {
            setMyItems(myItemsResponse.map((item) => new ItemDTO(item)))
          })
        } catch (error) {
          console.error('Failed to fetch page stats', error)
        }
      }

      fetchAndSetPageStats()
    }
  }, [authState.loggedIn])

  useEffect(() => {
    return () => {
      myItemsRequestControllerRef?.current?.abort()
    }
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 100%',
        minHeight: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ margin: '2em 1em 1em 2em' }}>
        <PageHeader>My Items</PageHeader>
        <Box
          sx={{
            margin: '2em 0 0 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1em',
            padding: '1em',
            background: 'rgba(245, 245, 245, 0.7)',
            border: '2px solid #d3c7a6'
          }}
        >
          {loadingMyItems
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
            : myItems.map((item, index) => {
                return (
                  <div key={`${item.id}-${index}`} onClick={() => goToItem(item.id)}>
                    <TinyItemCardWithImage item={item} className={classes.myItemCard} />
                  </div>
                )
              })}
        </Box>
      </Box>
    </Box>
  )
}

export default MyItemsPage
