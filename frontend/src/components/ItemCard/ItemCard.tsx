import { ImageDTO, ItemDTO, isArmor, isWeapon } from '@dmtool/application'
import { Box, Skeleton } from '@mui/material'
import LoadingIndicator from 'components/LoadingIndicator'
import StatsContainer from 'components/StatsContainer'
import TaperedRule from 'components/TaperedRule'
import _ from 'lodash'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import gray_brush_bg from 'assets/gray_brush_bg.png'
import Markdown from 'components/Markdown'

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      display: 'flex',
      gap: '1.5em'
    },
    root: {
      display: 'flex'
    },
    imageContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 auto',
      position: 'relative',
      flex: '1 1 auto',
      '&:before': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        left: '0',
        top: '0',
        opacity: '0.6',
        width: '100%',
        height: '100%',
        transform: 'translateY(2%)',
        background: `url(${gray_brush_bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '130%',
        zIndex: '1'
      },
      '& > img': {
        zIndex: '2',
        width: '100%',
        minWidth: '320px'
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
      lineHeight: '1.1em',
      letterSpacing: '1px',
      fontVariant: 'small-caps'
    },
    tinyDescription: {
      marginTop: 0,
      marginBottom: 0,
      fontStyle: 'italic',
      fontSize: '0.85em',
      textTransform: 'capitalize'
    },
    shortDescription: {
      margin: '0.6em 0',
      marginBottom: 0,
      fontWeight: 'normal',
      fontStyle: 'italic',
      fontSize: '0.95em',
      textTransform: 'capitalize',
      whiteSpace: 'pre-line',
      lineHeight: '1.1em'
    },
    mainDescription: {
      background: '#e0e4c3',
      padding: '0',
      margin: '0.2em 0 0 0',
      borderTop: '3px solid #1b1b1b',
      borderBottom: '3px solid #1b1b1b',
      '& > div > div > p': {
        margin: '0.5em 0'
      }
    },
    markdown: {
      '& p': {
        margin: '0.2em 0',
        whiteSpace: 'pre-wrap'
      },

      '& > table': {
        margin: '0.2em 0 0.4em 0',
        borderCollapse: 'collapse',
        '& td:first-of-type': {
          whiteSpace: 'nowrap'
        },
        '& th': {
          padding: '0 16px 0 4px'
        },
        '& td': {
          verticalAlign: 'text-top',
          border: `1px solid ${theme.palette.grey[600]}`,
          padding: '4px 8px'
        }
      },
      '& > ul': {
        margin: '0.5em 0'
      },
      '& > ul > li': {
        whiteSpace: 'pre-wrap'
      }
    },
    blockDescription: {
      margin: '0.3em 0.5em 0 0.5em'
    },
    inlineDescription: {
      display: 'inline',
      '& p': {
        display: 'inline'
      }
    },
    featureContainer: {
      margin: '0.5em 0 0.5em 0',
      whiteSpace: 'pre-line'
    },
    featureName: {
      color: '#1b1b1b',
      display: 'inline',
      letterSpacing: '1px',
      fontVariant: 'small-caps',
      padding: '0 4px 0 0',
      margin: 0
    },
    weaponFeatureName: {
      display: 'block',
      margin: '0 0 0.5em 0',
      fontFamily:
        '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
      color: theme.status.blood,
      fontSize: '1.3em',
      letterSpacing: '1px',
      fontVariant: 'small-caps',
      borderBottom: `1px solid ${theme.status.blood}`
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
    },
    weaponStats: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    rowBreak: {
      flexBasis: '100%',
      height: 0
    },
    weaponStatHeader: {
      color: theme.status.blood,
      fontSize: '1em',
      fontWeight: 'bold',
      lineHeight: '1.2em',
      padding: '8px 4px 2px 4px',
      flexGrow: '1',
      flexBasis: '0'
    },
    weaponStatValue: {
      flexGrow: '1',
      flexBasis: '0',
      background: '#e0e4c3',
      '& > span': {
        display: 'inline-block',
        padding: '6px 4px'
      }
    }
  }
})

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <div className={classes.blockDescription}>{children}</div>
}

const MainDescription: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <div className={classes.mainDescription}>{children}</div>
}

interface TinyStatProps {
  title: string
  value?: string | number | null
  noMargins?: boolean
}
const TinyStat: React.FC<TinyStatProps> = ({ title, value, noMargins = false }) => {
  const { classes } = useStyles()
  if (!value) {
    return null
  }

  return (
    <div className={noMargins ? '' : classes.blockDescription}>
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
  showSecondaryCategories?: boolean
  hideBgBrush?: boolean
  inlineFeatures?: boolean
  className?: string
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  inlineFeatures = false,
  image = null,
  loadingItem = false,
  loadingImage = false,
  showSecondaryCategories = true,
  hideBgBrush = false,
  className = ''
}) => {
  const { classes } = useStyles()

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
    <StatsContainer containerClassName={classes.container} rootClassName={className}>
      {!loadingItem ? (
        <>
          <Box sx={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column' }} className="itemCard-textContainer">
            <div className={`${classes.root}`}>
              <div className={classes.textContainer}>
                <h1 className={classes.name}>{item.name}</h1>
                <h2
                  className={classes.tinyDescription}
                  style={{
                    fontSize: item.shortDescription_label ? '0.85em' : '1em',
                    fontWeight: item.shortDescription_label ? 'bold' : 'normal'
                  }}
                >
                  <>{showSecondaryCategories ? item.all_categories_label || '' : item.main_categories_label || ''}</>
                  <>{item.rarity ? `${!_.isEmpty(item.categories) ? ', ' : ''}${item.rarity_label}` : '' || ''}</>
                  <span style={{ textTransform: 'none' }}> {item.requiresAttunement_label}</span>
                </h2>
                {item.shortDescription_label && (
                  <Box sx={{ fontSize: '0.95em', fontStyle: 'italic' }}>
                    <Markdown text={item.shortDescription_label} />
                  </Box>
                )}
                {isArmor(item) && (
                  <Box>
                    {item.armorClass_label && <TinyStat title="AC" value={item.armorClass_label} noMargins />}
                    {!!parseInt(item.strengthMinimum || '0') && <TinyStat title="Minimum STR" value={item.strengthMinimum} noMargins />}
                    {item.stealthDisadvantage === true && <TinyStat title="Stealth" value={'Disadvantage'} noMargins />}
                  </Box>
                )}
                {item.mainDescription && isWeapon(item) && (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <Markdown text={item.mainDescription} />
                  </div>
                )}
                {item.features?.map((feature: any, key: any) => {
                  return (
                    <div className={classes.featureContainer} key={key}>
                      {feature.featureName && (
                        <h4 className={`${classes.featureName} ${isWeapon(item) ? classes.weaponFeatureName : ''}`}>
                          {feature.featureName}
                        </h4>
                      )}
                      {feature.featureDescription &&
                        (inlineFeatures ? (
                          <Markdown className={classes.inlineDescription} text={feature.featureDescription} />
                        ) : (
                          <Markdown text={feature.featureDescription} />
                        ))}
                    </div>
                  )
                })}
              </div>
            </div>

            {isWeapon(item) &&
              (item.twoHandedDamage_full_label ||
                item.damage_full_label ||
                item.weight_label ||
                item.properties_label ||
                item.useRange_label ||
                item.throwRange_label) && (
                <div>
                  <TaperedRule />
                  <div className={classes.weaponStats}>
                    {(item.damage_full_label || item.twoHandedDamage_full_label) && <div className={classes.weaponStatHeader}>Damage</div>}
                    <div className={classes.weaponStatHeader}>Weight</div>
                    <div className={classes.weaponStatHeader}>Properties</div>
                    {item.useRange_label && <div className={classes.weaponStatHeader}>Range</div>}
                    {item.throwRange_label && <div className={classes.weaponStatHeader}>Thrown Range</div>}
                    <div className={classes.rowBreak} />
                    {(item.damage_full_label || item.twoHandedDamage_full_label) && (
                      <div className={classes.weaponStatValue}>
                        {item.damage_full_label && (
                          <span style={{ paddingBottom: item.twoHandedDamage_full_label ? 0 : '6px' }}>{item.damage_full_label}</span>
                        )}
                        {item.twoHandedDamage_full_label && (
                          <span style={{ paddingTop: item.damage_full_label ? 0 : '6px' }}>{item.twoHandedDamage_full_label}</span>
                        )}
                      </div>
                    )}
                    <div className={classes.weaponStatValue}>
                      <span>{item.weight_label}</span>
                    </div>
                    <div className={classes.weaponStatValue}>
                      <span style={{ textTransform: 'capitalize' }}>{item.properties_label}</span>
                    </div>
                    {item.useRange_label && (
                      <div className={classes.weaponStatValue}>
                        <span>{item.useRange_label}</span>
                      </div>
                    )}
                    {item.throwRange_label && (
                      <div className={classes.weaponStatValue}>
                        <span>{item.throwRange_label}</span>
                      </div>
                    )}
                  </div>
                  <TaperedRule />
                </div>
              )}
            <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {item.mainDescription && !isWeapon(item) && (
                <MainDescription>
                  <DescriptionBlock>
                    <ReactMarkdown className={classes.markdown} remarkPlugins={[remarkGfm]}>
                      {item.mainDescription}
                    </ReactMarkdown>
                  </DescriptionBlock>
                </MainDescription>
              )}
              {(item.weight_label || item.price_label) && (
                <div
                  style={{
                    display: 'flex',
                    margin: `0.5em 0 0px ${!isWeapon(item) ? '0' : '-0.5em'}`,
                    alignItems: 'flex-end'
                  }}
                >
                  {!isWeapon(item) && <TinyStat title="weight" value={item.weight_label} />}
                  <TinyStat title="price" value={item.price_label} />
                </div>
              )}
            </Box>
          </Box>
          {itemImage && !loadingImage && (
            <Box
              className={`${classes.imageContainer} itemCard-imageContainer`}
              sx={{
                '&&:before': {
                  ...(hideBgBrush
                    ? {
                        backgroundImage: 'none'
                      }
                    : {})
                }
              }}
            >
              <img alt={itemImage.props.alt} src={`${itemImage.props.src}`} />
            </Box>
          )}
          {loadingImage && (
            <Box
              className={`${classes.imageContainer} itemCard-imageContainer`}
              sx={{
                '&&': {
                  flex: '0 0 auto'
                },
                '&&:before': {
                  backgroundImage: 'none'
                }
              }}
            >
              <Skeleton variant="rounded" width={220} height={100} animation="wave" sx={{ margin: '3em 0 0 0' }} />
            </Box>
          )}
        </>
      ) : (
        <div className={classes.textContainer}>
          <Skeleton variant="rounded" width="100%" height={240} animation="wave" />
        </div>
      )}
    </StatsContainer>
  )
}

export default ItemCard
