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
                <DescriptionInline>
                  {feature.featureDescription}
                </DescriptionInline>
              </div>
            )
          })}
        </div>
        <div className={classes.imageContainer}>{currentItem.image}</div>
      </div>

      {currentItem.mainDescription && (
        <MainDescription>
          {currentItem.mainDescription.split("\n").map((value, key) => {
            return (
              <DescriptionBlock key={`description-${key}`}>
                {value}
              </DescriptionBlock>
            )
          })}
        </MainDescription>
      )}
      <OrangeBorder />
    </div>
  )
}

export default ItemStats
