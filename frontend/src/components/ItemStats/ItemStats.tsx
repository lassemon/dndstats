import StatsContainer from 'components/StatsContainer'
import React, { useMemo, useState } from 'react'
import { itemState } from 'infrastructure/dataAccess/atoms'
import useMediaQuery from '@mui/material/useMediaQuery'
import classNames from 'classnames/bind'

import useStyles from './ItemStats.styles'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useOrientation } from 'utils/hooks'
import { useAtom } from 'jotai'
import LoadingIndicator from 'components/LoadingIndicator'

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
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const [currentItem] = useAtom(useMemo(() => itemState, []))
  const [inlineFeatures, setInlineFeatures] = useState(false)

  const isPrint = useMediaQuery('print')
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

  const onChangeInlineFeatures = () => {
    setInlineFeatures((_inlineFeatures) => !_inlineFeatures)
  }

  if (!currentItem) {
    return <LoadingIndicator />
  }

  return (
    <>
      <StatsContainer
        className={cx({
          [classes.container]: true,
          [classes.smallContainer]: isPortrait,
          [classes.mediumContainer]: !isPortrait,
          [classes.printContainer]: isPrint
        })}
      >
        <div className={classes.root}>
          <div className={classes.textContainer}>
            <h1 className={classes.name}>{currentItem.name}</h1>
            <h2 className={classes.shortDescription}>{currentItem.shortDescription}</h2>
            {currentItem.features.map((feature: any, key: any) => {
              return (
                <div className={classes.featureContainer} key={key}>
                  {feature.featureName && <h3 className={classes.featureName}>{feature.featureName}</h3>}
                  {feature.featureDescription &&
                    (inlineFeatures || !feature.featureName ? (
                      <DescriptionInline>{feature.featureDescription}</DescriptionInline>
                    ) : (
                      <div>
                        {feature.featureDescription.split('\n').map((value: any, key: any) => {
                          return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
                        })}
                      </div>
                    ))}
                </div>
              )
            })}
            {currentItem.mainDescription && (
              <MainDescription>
                {currentItem.mainDescription.split('\n').map((value: any, key: any) => {
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
}

export default ItemStats
