import { ImageDTO, ItemDTO } from '@dmtool/application'
import { useMediaQuery, useTheme } from '@mui/material'
import classNames from 'classnames'
import LoadingIndicator from 'components/LoadingIndicator'
import StatsContainer from 'components/StatsContainer'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { useOrientation } from 'utils/hooks'

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      '@media print': {
        '&&&': {
          width: '100%'
        }
      }
    },
    smallContainer: {
      '&&': {
        width: '95%'
      }
    },
    mediumContainer: {
      '&&': {
        width: '80%'
      }
    },
    root: {
      display: 'flex'
    },
    imageContainer: {
      display: 'flex',
      alignItems: 'center',
      '& > img': {
        width: '100%'
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
      color: theme.status.blood,
      fontSize: '1.7em',
      letterSpacing: '1px',
      fontVariant: 'small-caps'
    },
    shortDescription: {
      marginTop: 0,
      fontWeight: 'normal',
      fontStyle: 'italic',
      fontSize: '0.95em'
    },
    mainDescription: {
      background: '#e0e4c3',
      padding: '0',
      margin: '1em 0 0 0',
      borderTop: '3px solid #1b1b1b',
      borderBottom: '3px solid #1b1b1b',
      '&> p': {
        margin: '0.5em'
      }
    },
    blockDescription: {
      margin: '0 0.5em 0.5em 0.5em'
    },
    inlineDescription: {
      display: 'inline'
    },
    featureContainer: {
      margin: '0 0 0.5em 0'
    },
    featureName: {
      color: '#1b1b1b',
      display: 'inline',
      letterSpacing: '1px',
      fontVariant: 'small-caps',
      padding: '0 4px 0 0',
      margin: 0
    },
    statHeader: {
      color: theme.status.blood,
      fontSize: '1.1em',
      lineHeight: '1.2em',
      fontWeight: 'bold',
      flexBasis: '16.6%',
      textAlign: 'center'
    },
    statValue: {
      color: theme.status.blood,
      fontSize: '1em',
      fontFamily: '"Helvetica", "Arial", sans-serif',
      flexBasis: '16.6%',
      display: 'inline-block',
      marginInlineStart: '0.5em',
      whiteSpace: 'nowrap'
    }
  }
})

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <p className={classes.blockDescription}>{children}</p>
}

const DescriptionInline: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <p className={classes.inlineDescription}>{children}</p>
}

const MainDescription: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <div className={classes.mainDescription}>{children}</div>
}

const TinyStat: React.FC<{ title: string; value?: string | number | null }> = (props) => {
  const { title, value } = props
  const { classes } = useStyles()
  if (!value) {
    return null
  }

  return (
    <div className={classes.blockDescription}>
      <span className={classes.statHeader}>{title}:</span>
      <span className={classes.statValue}>{value}</span>
    </div>
  )
}

interface ItemCardProps {
  item: ItemDTO | null
  image?: ImageDTO | null
  loadingItem?: boolean
  loadingImage?: boolean
  inlineFeatures?: boolean
  className?: string
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  inlineFeatures = false,
  image = null,
  loadingItem = false,
  loadingImage = false,
  className = ''
}) => {
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'
  const theme = useTheme()
  const isMedium = useMediaQuery(theme.breakpoints.up('md'))

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
    <StatsContainer>
      {!loadingItem ? (
        <>
          <div className={classes.root}>
            <div className={classes.textContainer}>
              <h1 className={classes.name}>{item.name}</h1>
              <h2 className={classes.shortDescription}>{item.shortDescription_label}</h2>
              {item.features.map((feature: any, key: any) => {
                return (
                  <div className={classes.featureContainer} key={key}>
                    {feature.featureName && <h4 className={classes.featureName}>{feature.featureName}</h4>}
                    {feature.featureDescription &&
                      (inlineFeatures || !feature.featureName ? (
                        <DescriptionInline>{feature.featureDescription}</DescriptionInline>
                      ) : (
                        <>
                          {feature.featureDescription.split('\n').map((value: any, key: any) => {
                            return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
                          })}
                        </>
                      ))}
                  </div>
                )
              })}
            </div>

            {itemImage && !loadingImage && (
              <div className={classes.imageContainer}>
                <img alt={itemImage.props.alt} src={`${itemImage.props.src}`} />
              </div>
            )}
            {loadingImage && (
              <div className={classes.imageContainer}>
                <LoadingIndicator />
              </div>
            )}
          </div>
          {item.mainDescription && (
            <MainDescription>
              {item.mainDescription.split('\n').map((value: any, key: any) => {
                return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
              })}
            </MainDescription>
          )}
        </>
      ) : (
        <div className={classes.textContainer}>
          <LoadingIndicator />
        </div>
      )}
      <div style={{ display: 'flex', margin: '1em 0 -5px 0' }}>
        <TinyStat title="weight" value={item.weight} />
        <TinyStat title="price" value={item.price} />
      </div>
    </StatsContainer>
  )
}

export default ItemCard
