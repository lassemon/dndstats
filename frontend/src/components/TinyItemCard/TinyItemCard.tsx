import { ImageDTO, ItemDTO } from '@dmtool/application'
import { Box, Chip, Skeleton, Typography } from '@mui/material'
import underline from 'assets/underline.png'
import _ from 'lodash'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { dateStringFromUnixTime } from '@dmtool/common'
import { useAtom } from 'jotai'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import gray_brush_bg from 'assets/gray_brush_bg.png'
import { Visibility } from '@dmtool/domain'

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      minWidth: '10em',
      height: '100%',
      borderRadius: '4px',
      borderBottom: `2px solid ${theme.palette.primary.dark}`,
      '&:hover': {
        background: theme.palette.primary.main,
        cursor: 'pointer'
      }
    },
    textRoot: {
      display: 'flex'
    },
    imageRoot: {
      width: '100%',
      flex: '1 1 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    imageContainer: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      maxWidth: '120px',
      minHeight: '120px',
      maxHeight: '140px',
      '&:before': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        left: '0',
        top: '0',
        opacity: '0.6',
        width: '100%',
        height: '100%',
        background: `url(${gray_brush_bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '130%',
        zIndex: '1'
      },
      '& > img': {
        zIndex: '2',
        margin: '1em auto',
        maxHeight: '140px'
      },
      '& > div': {
        alignItems: 'center',
        '& .MuiCircularProgress-root': {
          margin: '6em'
        }
      }
    },
    textContainer: {
      flex: '1 0 60%'
    },
    name: {
      margin: '0',
      fontFamily:
        '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
      color: theme.palette.primary.contrastText,
      fontSize: '1em',
      letterSpacing: '1px',
      fontVariant: 'small-caps',
      '&:after': {
        display: 'block',
        content: '" "',
        background: `url(${underline})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '10px'
      }
    },
    tinyDescription: {
      marginTop: 0,
      marginBottom: 0,
      fontStyle: 'italic',
      fontSize: '0.65em',
      textTransform: 'capitalize'
    }
  }
})

interface TinyItemCardProps {
  item: ItemDTO | null
  image?: ImageDTO | null
  loadingItem?: boolean
  loadingImage?: boolean
  className?: string
}

export const TinyItemCard: React.FC<TinyItemCardProps> = ({
  item,
  image = null,
  loadingItem = false,
  loadingImage = false,
  className = ''
}) => {
  const { classes } = useStyles()
  const [authState] = useAtom(authAtom)

  const itemImage = image
    ? React.createElement('img', {
        alt: image.fileName,
        src: image.base64,
        hash: image.createdAt || image.updatedAt
      })
    : null

  if (!item) {
    return null
  }

  return (
    <Box className={`${classes.root} ${className}`}>
      {!loadingItem ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            padding: '0.5em'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
            <div>
              <div className={`${classes.textRoot}`}>
                <div className={classes.textContainer}>
                  <h1 className={classes.name}>{item.name}</h1>
                  <h2
                    className={classes.tinyDescription}
                    style={{
                      fontSize: '0.85em',
                      fontWeight: 'normal'
                    }}
                  >
                    <>{item.main_categories_label || ''}</>
                    <>{item.rarity ? `${!_.isEmpty(item.categories) ? ', ' : ''}${item.rarity_label}` : '' || ''}</>
                    <span style={{ textTransform: 'none' }}> {item.requiresAttunement_label}</span>
                  </h2>
                </div>
              </div>
            </div>
            {itemImage && !loadingImage && (
              <Box className={classes.imageRoot}>
                <Box className={classes.imageContainer}>
                  <img alt={itemImage.props.alt} src={`${itemImage.props.src}`} />
                </Box>
              </Box>
            )}
            {!itemImage && !loadingImage && (
              <div>
                <Box sx={{ margin: '1em' }} />
              </div>
            )}
            {loadingImage && (
              <Box
                className={classes.imageContainer}
                sx={{
                  '&&:before': {
                    backgroundImage: 'none'
                  }
                }}
              >
                <Skeleton variant="rounded" width="100%" height={100} animation="wave" sx={{ margin: '0.5em 0.5em 1em 0.5em' }} />
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
              {item.createdByUserName && (
                <Typography variant="body2" sx={{ fontSize: '0.6em' }}>
                  Created by:{' '}
                  <span style={{ fontWeight: '600', margin: '0.4em 0 0 0' }}>{item.getCreatedByUserName(authState.user?.id)}</span>
                </Typography>
              )}
              {item.updatedAt && (
                <Typography variant="body2" sx={{ fontSize: '0.6em' }}>
                  <span>{dateStringFromUnixTime(item.updatedAt)}</span>
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                {item.getSource(authState.user?.id) && (
                  <Typography
                    variant="caption"
                    color="secondary"
                    sx={{ fontSize: '0.6em', fontWeight: '600', whiteSpace: 'nowrap', lineHeight: 'normal' }}
                  >
                    {item.getSource(authState.user?.id)}
                  </Typography>
                )}
                {authState.loggedIn && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7em',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      lineHeight: 'normal',
                      color: (theme) =>
                        item.visibility === Visibility.PUBLIC
                          ? theme.palette.success.main
                          : item.visibility === Visibility.LOGGED_IN
                          ? theme.palette.warning.main
                          : item.visibility === Visibility.PRIVATE
                          ? theme.palette.error.main
                          : theme.palette.common.black
                    }}
                  >
                    {item.visibility_label}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <div className={classes.textContainer}>
          <Skeleton variant="rounded" width="80%" height={60} animation="wave" sx={{ margin: '0 0 1em 0' }} />
        </div>
      )}
    </Box>
  )
}

export default TinyItemCard
