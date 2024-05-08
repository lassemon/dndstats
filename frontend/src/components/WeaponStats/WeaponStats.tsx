import StatsContainer from 'components/StatsContainer'
import TaperedRule from 'components/TaperedRule'
import React, { Fragment, useMemo } from 'react'
import { weaponAtom } from 'infrastructure/dataAccess/atoms'

import useStyles from './WeaponStats.styles'
import { useAtom } from 'jotai'
import LoadingIndicator from 'components/LoadingIndicator'
import { ImageDTO } from '@dmtool/application'

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <p className={classes.description}>{children}</p>
}

interface WeaponStatsProps {
  screenshotMode?: boolean
  image?: ImageDTO | null
  loadingImage?: boolean
}

export const WeaponStats: React.FC<WeaponStatsProps> = ({ image = null, loadingImage = false }) => {
  const { classes } = useStyles()
  const [currentWeapon] = useAtom(useMemo(() => weaponAtom, []))

  const weaponImage = image
    ? React.createElement('img', {
        alt: image.fileName,
        src: image.base64,
        hash: image.createdAt || image.updatedAt
      })
    : null

  if (!currentWeapon) {
    return <LoadingIndicator />
  }

  return (
    <StatsContainer>
      <div className={classes.topContainer}>
        <div className={classes.headerContainer}>
          <h1 className={classes.name}>{currentWeapon.name}</h1>
          <h2 className={classes.shortDescription}>{currentWeapon.shortDescription}</h2>
          {currentWeapon.mainDescription.split('\n').map((value, key) => {
            return <DescriptionBlock key={key}>{value}</DescriptionBlock>
          })}
          {currentWeapon.features.map((feature, key) => {
            return (
              <Fragment key={key}>
                <h3 key={`header-${key}`} className={classes.featureName}>
                  {feature.featureName}
                </h3>
                {feature.featureDescription.split('\n').map((value, key) => {
                  return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
                })}
              </Fragment>
            )
          })}
        </div>
        {weaponImage && !loadingImage && (
          <div className={classes.imageContainer}>
            <img alt={weaponImage.props.alt} src={`${weaponImage.props.src}`} />
          </div>
        )}
        {loadingImage && (
          <div className={classes.imageContainer}>
            <LoadingIndicator />
          </div>
        )}
      </div>
      <div>
        <TaperedRule />
        <div className={classes.stats}>
          <div className={classes.statHeader}>Damage</div>
          <div className={classes.statHeader}>Weight</div>
          <div className={classes.statHeader}>Properties</div>
          <div className={classes.rowBreak} />
          <div className={classes.statValue}>
            <span>{currentWeapon.damage.damageDice}</span>
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
    </StatsContainer>
  )
}

export default WeaponStats
