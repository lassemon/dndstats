import StatsContainer from 'components/StatsContainer'
import TaperedRule from 'components/TaperedRule'
import React, { CSSProperties, Fragment, useMemo, useState } from 'react'
import { spellState } from 'infrastructure/dataAccess/atoms'
import useMediaQuery from '@mui/material/useMediaQuery'
import classNames from 'classnames/bind'

import useStyles from './SpellStats.styles'
import _ from 'lodash'
import { Box, Checkbox, FormControlLabel, FormGroup, useTheme } from '@mui/material'
import { useOrientation } from 'utils/hooks'
import { useAtom } from 'jotai'
import LoadingIndicator from 'components/LoadingIndicator'

const DescriptionBlock: React.FC<{ style?: CSSProperties }> = (props) => {
  const { children, style } = props
  const { classes } = useStyles()
  return (
    <p className={classes.blockDescription} style={style}>
      {children}
    </p>
  )
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
  const [currentSpell] = useAtom(useMemo(() => spellState, []))
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'
  const isPrint = useMediaQuery('print')
  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('xl'))
  const [inlineFeatures, setInlineFeatures] = useState(true)

  const onChangeInlineFeatures = () => {
    setInlineFeatures((_inlineFeatures) => !_inlineFeatures)
  }

  if (!currentSpell) {
    return <LoadingIndicator />
  }

  return (
    <>
      <StatsContainer
        className={cx({
          [classes.container]: true,
          [classes.smallContainer]: isPortrait,
          [classes.largeContainer]: isLarge,
          [classes.printContainer]: isPrint
        })}
      >
        <div className={classes.topContainer}>
          <div className={classes.headerContainer}>
            <h1 className={classes.name}>{currentSpell.name}</h1>
            <h2 className={classes.shortDescription}>{currentSpell.shortDescription}</h2>
            {currentSpell.castingtime && (
              <div>
                <h3 className={classes.featureName}>Casting Time</h3>
                <DescriptionInline>{currentSpell.castingtime}</DescriptionInline>
              </div>
            )}
            {currentSpell.range && (
              <div>
                <h3 className={classes.featureName}>Range</h3>
                <DescriptionInline>{currentSpell.range}</DescriptionInline>
              </div>
            )}
            {currentSpell.components && (
              <div>
                <h3 className={classes.featureName}>Components</h3>
                <DescriptionInline>{currentSpell.components}</DescriptionInline>
              </div>
            )}
            {currentSpell.duration && (
              <div>
                <h3 className={classes.featureName}>Duration</h3>
                <DescriptionInline>{currentSpell.duration}</DescriptionInline>
              </div>
            )}
            {currentSpell.classes && (
              <div>
                <h3 className={classes.featureName}>Classes</h3>
                <DescriptionInline>{currentSpell.classes}</DescriptionInline>
              </div>
            )}
          </div>
        </div>

        {currentSpell.mainDescription && (
          <MainDescription>
            {currentSpell.mainDescription.split('\n').map((value, index) => {
              return (
                <DescriptionBlock key={`description-${index}`} style={{ margin: 0 }}>
                  {value}
                </DescriptionBlock>
              )
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
                    (inlineFeatures || !feature.featureName ? (
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
      <Box displayPrint="none">
        <FormGroup>
          <FormControlLabel control={<Checkbox color="secondary" checked={inlineFeatures} onChange={onChangeInlineFeatures} />} label="Inline features" />
        </FormGroup>
      </Box>
    </>
  )
}

export default SpellStats
