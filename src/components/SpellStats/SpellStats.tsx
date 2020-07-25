import TaperedRule from 'components/TaperedRule'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { spellState } from 'recoil/atoms'

import useStyles from './SpellStats.styles'

const OrangeBorder: React.FC = () => {
  const classes = useStyles()
  return <hr className={classes.orangeBorder} />
}

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const classes = useStyles()
  return <p className={classes.blockDescription}>{children}</p>
}

const DescriptionInline: React.FC = (props) => {
  const { children } = props
  const classes = useStyles()
  return <p className={classes.inlineDescription}>{children}</p>
}

const MainDescription: React.FC = (props) => {
  const { children } = props
  const classes = useStyles()
  return <div className={classes.mainDescription}>{children}</div>
}

export const SpellStats: React.FC = () => {
  const classes = useStyles()
  const currentSpell = useRecoilValue(spellState)

  return (
    <div className={classes.root}>
      <OrangeBorder />
      <div className={classes.topContainer}>
        <div className={classes.headerContainer}>
          <h1 className={classes.name}>{currentSpell.name}</h1>
          <h2 className={classes.shortDescription}>
            {currentSpell.shortDescription}
          </h2>
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
          {currentSpell.mainDescription.split("\n").map((value, key) => {
            return (
              <DescriptionBlock key={`description-${key}`}>
                {value}
              </DescriptionBlock>
            )
          })}
        </MainDescription>
      )}
      {currentSpell.athigherlevels && (
        <>
          <TaperedRule />
          <MainDescription>
            <h3 className={classes.featureName}>At higher levels</h3>
            <DescriptionInline>{currentSpell.athigherlevels}</DescriptionInline>
          </MainDescription>
        </>
      )}
      <OrangeBorder />
    </div>
  )
}

export default SpellStats
