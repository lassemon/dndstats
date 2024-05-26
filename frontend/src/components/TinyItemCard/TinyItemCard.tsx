import { ImageDTO, ItemDTO } from '@dmtool/application'
import { Box, Skeleton, Typography } from '@mui/material'
import LoadingIndicator from 'components/LoadingIndicator'
import underline from 'assets/underline.png'
import _ from 'lodash'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { dateStringFromUnixTime } from '@dmtool/common'
import { useAtom } from 'jotai'
import { authAtom } from 'infrastructure/dataAccess/atoms'

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      minWidth: '10em',
      padding: '0.6em 0.6em 1em 0.6em',
      margin: '0 0 1.4em 0',
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
    imageContainer: {
      maxWidth: '60%',
      display: 'flex',
      alignItems: 'center',
      '& > img': {
        width: '100%',
        minWidth: '120px'
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
        <>
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
            <div className={classes.imageContainer}>
              <img alt={itemImage.props.alt} src={`${itemImage.props.src}`} />
            </div>
          )}
          {loadingImage && (
            <div className={classes.imageContainer}>
              <Skeleton variant="rounded" width="100%" height={100} animation="wave" />
            </div>
          )}
          {item.createdByUserName && (
            <Typography variant="body2" sx={{ fontSize: '0.6em', margin: '1em  0 0 0' }}>
              Created by: <span style={{ fontWeight: '600', margin: '0.4em 0 0 0' }}>{item.getCreatedByUserName(authState.user?.id)}</span>
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'end', margin: '0 0 -1em 0', justifyContent: 'space-between' }}>
            {item.updatedAt && (
              <Typography variant="body2" sx={{ fontSize: '0.6em' }}>
                <span>{dateStringFromUnixTime(item.updatedAt)}</span>
              </Typography>
            )}
            {item.getSource(authState.user?.id) && (
              <Typography
                variant="caption"
                color="secondary"
                sx={{ fontSize: '0.6em', margin: '0 0 0 1em', fontWeight: '600', whiteSpace: 'nowrap' }}
              >
                {item.getSource(authState.user?.id)}
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <div className={classes.textContainer}>
          <LoadingIndicator />
        </div>
      )}
    </Box>
  )
}

export default TinyItemCard
