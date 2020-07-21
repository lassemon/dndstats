import React from 'react'
import { useRecoilValue } from 'recoil'
import { itemState } from 'recoil/atoms'

import useStyles from './ItemStats.styles'

const OrangeBorder: React.FC = () => {
  const classes = useStyles()
  return <hr className={classes.orangeBorder} />
}

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const classes = useStyles()
  return <p className={classes.description}>{children}</p>
}

const MainDescription: React.FC = (props) => {
  const { children } = props
  const classes = useStyles()
  return <p className={classes.mainDescription}>{children}</p>
}

export const ItemStats: React.FC = () => {
  const classes = useStyles()
  const currentItem = useRecoilValue(itemState)

  return (
    <div className={classes.root}>
      <OrangeBorder />
      <div className={classes.topContainer}>
        <div className={classes.headerContainer}>
          <h1 className={classes.name}>{currentItem.name}</h1>
          <h2 className={classes.shortDescription}>
            {currentItem.shortDescription}
          </h2>
          {currentItem.features.map((feature, key) => {
            return (
              <div key={key}>
                <h3 key={`header-${key}`} className={classes.featureName}>
                  {feature.featureName}
                </h3>
                <DescriptionBlock>
                  {feature.featureDescription}
                </DescriptionBlock>
              </div>
            )
          })}
        </div>
        <div>{currentItem.image}</div>
      </div>

      {currentItem.mainDescription && (
        <MainDescription>{currentItem.mainDescription}</MainDescription>
      )}
      <OrangeBorder />
    </div>
  )
}

export default ItemStats
