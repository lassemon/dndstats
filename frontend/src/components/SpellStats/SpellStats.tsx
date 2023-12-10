import StatsContainer from 'components/StatsContainer'
import TaperedRule from 'components/TaperedRule'
import React, { Fragment, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { spellState } from 'recoil/atoms'
import useMediaQuery from '@mui/material/useMediaQuery'
import classNames from 'classnames/bind'

import useStyles from './SpellStats.styles'
import _ from 'lodash'
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

export const SpellStats: React.FC = () => {
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const currentSpell = useRecoilValue(spellState)
  const isMedium = useMediaQuery('(max-width:80em)')
  const isPrint = useMediaQuery('print')
  const [inlineFeatures, setInlineFeatures] = useState(true)

  const onChangeInlineFeatures = () => {
    setInlineFeatures((_inlineFeatures) => !_inlineFeatures)
  }

  if (currentSpell) {
    return (
      <>
        <StatsContainer
          className={cx({
            [classes.container]: true,
            [classes.mediumContainer]: isMedium,
            [classes.printContainer]: isPrint
          })}
        >
          <div className={classes.topContainer}>
            <div className={classes.headerContainer}>
              <h1 className={classes.name}>{currentSpell.name}</h1>
              <h2 className={classes.shortDescription}>{currentSpell.shortDescription}</h2>
              <div>
                <h3 className={classes.featureName}>Casting Time</h3>
                <DescriptionInline>{currentSpell.castingtime}</DescriptionInline>
              </div>
              <div>
                <h3 className={classes.featureName}>Range</h3>
                <DescriptionInline>{currentSpell.range}</DescriptionInline>
              </div>
              <div>
                <h3 className={classes.featureName}>Components</h3>
                <DescriptionInline>{currentSpell.components}</DescriptionInline>
              </div>
              <div>
                <h3 className={classes.featureName}>Duration</h3>
                <DescriptionInline>{currentSpell.duration}</DescriptionInline>
              </div>
              <div>
                <h3 className={classes.featureName}>Classes</h3>
                <DescriptionInline>{currentSpell.classes}</DescriptionInline>
              </div>
            </div>
          </div>

          {currentSpell.mainDescription && (
            <MainDescription>
              {currentSpell.mainDescription.split('\n').map((value, index) => {
                return <DescriptionBlock key={`description-${index}`}>{value}</DescriptionBlock>
              })}
            </MainDescription>
          )}
          {!_.isEmpty(currentSpell.features) &&
            currentSpell.features.map((feature, index) => {
              return (
                <Fragment key={index}>
                  <TaperedRule />
                  <MainDescription>
                    {feature.featureName && <h3 className={classes.featureName}>{feature.featureName}</h3>}
                    {feature.featureDescription &&
                      (inlineFeatures ? (
                        <DescriptionInline>{feature.featureDescription}</DescriptionInline>
                      ) : (
                        <div>
                          {feature.featureDescription.split('\n').map((value, index) => {
                            return <DescriptionBlock key={`description-${index}`}>{value}</DescriptionBlock>
                          })}
                        </div>
                      ))}
                  </MainDescription>
                </Fragment>
              )
            })}
          {currentSpell.athigherlevels && (
            <>
              <TaperedRule />
              <MainDescription>
                <h3 className={classes.featureName}>At higher levels</h3>
                <DescriptionInline>{currentSpell.athigherlevels}</DescriptionInline>
              </MainDescription>
            </>
          )}
        </StatsContainer>
        <FormGroup>
          <FormControlLabel control={<Checkbox color="secondary" checked={inlineFeatures} onChange={onChangeInlineFeatures} />} label="Inline features" />
        </FormGroup>
      </>
    )
  } else {
    return null
  }
}

export default SpellStats
