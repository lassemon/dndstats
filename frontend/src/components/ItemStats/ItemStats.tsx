import StatsContainer from 'components/StatsContainer'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { itemState } from 'recoil/atoms'
import useMediaQuery from '@mui/material/useMediaQuery'
import classNames from 'classnames/bind'

import useStyles from './ItemStats.styles'
import LoadingIndicator from 'components/LoadingIndicator'
import { useTheme } from '@mui/material/styles'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

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

export const ItemStats: React.FC = () => {
  const theme = useTheme()
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const currentItem = useRecoilValue(itemState)
  const [inlineFeatures, setInlineFeatures] = useState(false)

  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isMedium = useMediaQuery(theme.breakpoints.up('md'))
  const isPrint = useMediaQuery('print')

  const onChangeInlineFeatures = () => {
    setInlineFeatures((_inlineFeatures) => !_inlineFeatures)
  }

  if (currentItem) {
    return (
      <>
        <StatsContainer
          className={cx({
            [classes.container]: true,
            [classes.smallContainer]: isSmall,
            [classes.mediumContainer]: isMedium,
            [classes.printContainer]: isPrint
          })}
        >
          <div className={classes.root}>
            <div className={classes.textContainer}>
              <h1 className={classes.name}>{currentItem.name}</h1>
              <h2 className={classes.shortDescription}>{currentItem.shortDescription}</h2>
              {currentItem.features.map((feature, key) => {
                return (
                  <div className={classes.featureContainer} key={key}>
                    <h3 className={classes.featureName}>{feature.featureName}</h3>
                    {feature.featureDescription &&
                      (inlineFeatures ? (
                        <DescriptionInline>{feature.featureDescription}</DescriptionInline>
                      ) : (
                        <div>
                          {feature.featureDescription.split('\n').map((value, key) => {
                            return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
                          })}
                        </div>
                      ))}
                  </div>
                )
              })}
              {currentItem.mainDescription && (
                <MainDescription>
                  {currentItem.mainDescription.split('\n').map((value, key) => {
                    return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
                  })}
                </MainDescription>
              )}
            </div>
            <div className={classes.imageContainer}>
              <img alt={currentItem.image.props.alt} src={`${currentItem.image.props.src}`} />
            </div>
          </div>
        </StatsContainer>
        <FormGroup>
          <FormControlLabel control={<Checkbox color="secondary" checked={inlineFeatures} onChange={onChangeInlineFeatures} />} label="Inline features" />
        </FormGroup>
      </>
    )
  } else {
    return <LoadingIndicator />
  }
}

export default ItemStats
