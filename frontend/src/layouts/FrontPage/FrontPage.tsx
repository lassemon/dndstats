import { ImageDTO, ItemDTO } from '@dmtool/application'
import { Box, Skeleton, Typography, TypographyProps, useMediaQuery, useTheme } from '@mui/material'
import { PageStatsService } from 'application/services/PageStatsService'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import { useAtom } from 'jotai'
import ItemCard from 'components/ItemCard'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import { makeStyles } from 'tss-react/mui'
import { unstable_batchedUpdates } from 'react-dom'
import TinyItemCardWithImage from 'components/TinyItemCard/TinyItemCardWithImage'

const imageRepository = new ImageRepository()
const pageStatsService = new PageStatsService()

const FrontPageHeader: React.FC<TypographyProps> = ({ sx, ...props }) => {
  return (
    <Typography
      variant="h6"
      sx={{
        ...{
          textDecoration: 'underline',
          textUnderlineOffset: '0.45em',
          textDecorationThickness: '2px',
          borderBottom: (theme) => `3px solid ${theme.palette.primary.dark}`,
          width: '90%',
          whiteSpace: 'nowrap'
        },
        ...sx
      }}
      {...props}
    />
  )
}

export const useStyles = makeStyles()((theme) => ({
  itemCard: {
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
        minWidth: '240px'
      }
    }
  }
}))

const FrontPage: React.FC = () => {
  const [loadingPageStats, setLoadingPageStats] = useState(true)
  const [loadingImage, setLoadingImage] = useState(true)
  const [featuredItem, setFeaturedItem] = useState<ItemDTO | null>(null)
  const [trendingItems, setTrendingItems] = useState<ItemDTO[]>([])
  const [latestItems, setLatestItems] = useState<ItemDTO[]>([])
  const imageId = featuredItem?.imageId
  const [image, setImage] = useState<ImageDTO | null | undefined>(null)
  const navigate = useNavigate()
  const [authState] = useAtom(authAtom)
  const { classes } = useStyles()

  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('xl'))

  const imageRequestControllerRef = useRef<AbortController | null>(null)
  const itemRequestControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const fetchAndSetPageStats = async () => {
      try {
        setLoadingPageStats(true)
        const controller = new AbortController()
        itemRequestControllerRef.current = controller

        const pageStatsResponse = await pageStatsService.getPageStats({ signal: controller.signal }).finally(() => {
          setLoadingPageStats(false)
        })
        unstable_batchedUpdates(() => {
          setFeaturedItem(new ItemDTO(pageStatsResponse.featuredItem))
          setTrendingItems(pageStatsResponse.trendingItems.map((item) => new ItemDTO(item)))
          setLatestItems(pageStatsResponse.latestItems.map((item) => new ItemDTO(item)))
        })
      } catch (error) {
        console.error('Failed to fetch page stats', error)
      }
    }

    fetchAndSetPageStats()
  }, [authState.loggedIn])

  useEffect(() => {
    const fetchAndSetImage = async (_imageId: string) => {
      try {
        setLoadingImage(true)
        const controller = new AbortController()
        imageRequestControllerRef.current = controller

        const fetchedImage = await imageRepository.getById(_imageId, { signal: controller.signal })
        unstable_batchedUpdates(() => {
          setLoadingImage(false)
          setImage(new ImageDTO(fetchedImage))
        })
      } catch (error) {
        setLoadingImage(false)
      }
    }
    if (imageId) {
      fetchAndSetImage(imageId)
    }
  }, [imageId])

  useEffect(() => {
    return () => {
      itemRequestControllerRef?.current?.abort()
      imageRequestControllerRef?.current?.abort()
    }
  }, [])

  const goToItem = (itemId?: string) => {
    if (itemId) {
      navigate(`/card/item/${itemId}`, { replace: true })
    }
  }

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
      <Box sx={{ margin: '2em 1em 1em 2em', display: 'flex', flexWrap: 'wrap', gap: '1em' }}>
        <Box sx={{ flex: '6' }}>
          <FrontPageHeader sx={{ opacity: loadingPageStats ? '0.4' : '1' }}>Featured Item</FrontPageHeader>
          <Box sx={{ margin: '1.5em 0.5em 0.5em 0', width: isLarge ? '95%' : '98%' }}>
            {loadingPageStats ? (
              <Skeleton variant="rounded" width="100%" height={600} animation="wave" />
            ) : (
              <div onClick={() => goToItem(featuredItem?.id)}>
                <ItemCard
                  item={featuredItem}
                  loadingItem={loadingPageStats}
                  image={image}
                  loadingImage={loadingImage}
                  className={classes.itemCard}
                />
              </div>
            )}
          </Box>
        </Box>
        <Box sx={{ flex: '4', display: 'flex', gap: '1.5em' }}>
          <Box
            sx={{
              flex: '1',
              maxHeight: '95dvh',
              overflowY: 'scroll',
              scrollbarWidth: 'thin',
              minWidth: '12em',
              padding: '0.4em 1em 0.4em 1em',
              background: 'rgba(245, 245, 245, 0.7)',
              borderRadius: '0.5em'
            }}
          >
            <FrontPageHeader sx={{ opacity: loadingPageStats ? '0.4' : '1' }}>Latest Items</FrontPageHeader>
            <Box sx={{ margin: '1.5em 0.5em 0.5em 0', width: '90%', '&& > .stats-container': { margin: '0 0 1em 0' } }}>
              {loadingPageStats ? (
                <>
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                </>
              ) : (
                latestItems.map((latestItem) => {
                  return (
                    <div key={latestItem.id} onClick={() => goToItem(latestItem.id)}>
                      <TinyItemCardWithImage item={latestItem} />
                    </div>
                  )
                })
              )}
            </Box>
          </Box>
          <Box
            sx={{
              flex: '1',
              maxHeight: '95dvh',
              overflowY: 'scroll',
              scrollbarWidth: 'thin',
              minWidth: '17em',
              padding: '0.4em 1em 0.4em 1em',
              background: 'rgba(245, 245, 245, 0.7)',
              borderRadius: '0.5em'
            }}
          >
            <FrontPageHeader sx={{ opacity: loadingPageStats ? '0.4' : '1' }}>Trending Items</FrontPageHeader>
            <Box sx={{ margin: '1.5em 1em 0.5em 0', '&& > .stats-container': { margin: '0 0 1em 0' } }}>
              {loadingPageStats ? (
                <>
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                  <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
                </>
              ) : (
                trendingItems.map((trendingItem) => {
                  return (
                    <div key={trendingItem.id} onClick={() => goToItem(trendingItem.id)}>
                      <TinyItemCardWithImage item={trendingItem} />
                    </div>
                  )
                })
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* TODO, HERE BE MONSTERS
      <Box sx={{ margin: '2em 4em 1em 4em', display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1' }}>
          <FrontPageHeader>Featured Monster</FrontPageHeader>
        </Box>
        <Box sx={{ flex: '1' }}>
          <FrontPageHeader>Trending Monsters</FrontPageHeader>
        </Box>
      </Box>
          */}
    </Box>
  )
}

export default FrontPage
