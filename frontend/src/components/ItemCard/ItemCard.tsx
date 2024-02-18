import { ImageDTO } from '@dmtool/application'
import { Item } from '@dmtool/domain'
import classNames from 'classnames'
import LoadingIndicator from 'components/LoadingIndicator'
import StatsContainer from 'components/StatsContainer'
import React, { useEffect, useState } from 'react'
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

interface ItemCardProps {
  item: Item | null
  image?: ImageDTO | null
  loadingItem?: boolean
  loadingImage?: boolean
  inlineFeatures?: boolean
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, inlineFeatures = false, image = null, loadingItem = false, loadingImage = false }) => {
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

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
    <StatsContainer
      className={cx({
        [classes.container]: true,
        [classes.smallContainer]: isPortrait,
        [classes.mediumContainer]: !isPortrait
      })}
    >
      {!loadingItem ? (
        <div className={classes.root}>
          <div className={classes.textContainer}>
            <h1 className={classes.name}>{item.name}</h1>
            <h2 className={classes.shortDescription}>{item.shortDescription}</h2>
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
            {item.mainDescription && (
              <MainDescription>
                {item.mainDescription.split('\n').map((value: any, key: any) => {
                  return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
                })}
              </MainDescription>
            )}
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
      ) : (
        <div className={classes.textContainer}>
          <LoadingIndicator />
        </div>
      )}
    </StatsContainer>
  )
}

export default ItemCard
