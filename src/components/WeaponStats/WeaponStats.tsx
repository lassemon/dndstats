import TaperedRule from 'components/TaperedRule'
import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'
import { weaponState } from 'recoil/atoms'

import useStyles from './WeaponStats.styles'

const OrangeBorder: React.FC = () => {
  const classes = useStyles()
  return <hr className={classes.orangeBorder} />
}

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const classes = useStyles()
  return <p className={classes.description}>{children}</p>
}

export const WeaponStats: React.FC = () => {
  const classes = useStyles()
  const currentWeapon = useRecoilValue(weaponState)

  return (
    <div className={classes.root}>
      <OrangeBorder />
      <h1 className={classes.name}>{currentWeapon.name}</h1>
      <h2 className={classes.shortDescription}>
        {currentWeapon.shortDescription}
      </h2>
      {currentWeapon.mainDescription.split("\n").map((value, key) => {
        return <DescriptionBlock key={key}>{value}</DescriptionBlock>
      })}
      {currentWeapon.features.map((feature, key) => {
        return (
          <Fragment key={key}>
            <h3 key={`header-${key}`} className={classes.featureName}>
              {feature.featureName}
            </h3>
            {feature.featureDescription.split("\n").map((value, key) => {
              return (
                <DescriptionBlock key={`description-${key}`}>
                  {value}
                </DescriptionBlock>
              )
            })}
          </Fragment>
        )
      })}
      <div className={classes.statsContainer}>
        <TaperedRule />
        <div className={classes.stats}>
          <div className={classes.statHeader}>Damage</div>
          <div className={classes.statHeader}>Weight</div>
          <div className={classes.statHeader}>Properties</div>
          <div className={classes.rowBreak} />
          <div className={classes.statValue}>
            <span>{currentWeapon.damage}</span>
          </div>
          <div className={classes.statValue}>
            <span>{currentWeapon.weight}</span>
          </div>
          <div className={classes.statValue}>
            <span>{currentWeapon.properties}</span>
          </div>
        </div>
        <TaperedRule />
      </div>
      <OrangeBorder />
    </div>
  )
}

export default WeaponStats
