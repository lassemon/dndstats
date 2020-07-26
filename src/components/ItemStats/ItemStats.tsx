import StatsContainer from 'components/StatsContainer'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { itemState } from 'recoil/atoms'

import useStyles from './ItemStats.styles'

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
    <StatsContainer>
      <div className={classes.root}>
        <div className={classes.textContainer}>
          <h1 className={classes.name}>{currentItem.name}</h1>
          <h2 className={classes.shortDescription}>
            {currentItem.shortDescription}
          </h2>
          {currentItem.features.map((feature, key) => {
            return (
              <div className={classes.featureContainer} key={key}>
                <h3 className={classes.featureName}>{feature.featureName}</h3>
                <DescriptionInline>
                  {feature.featureDescription}
                </DescriptionInline>
              </div>
            )
          })}
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
        </div>
        <div className={classes.imageContainer}>{currentItem.image}</div>
      </div>
    </StatsContainer>
  )
}

export default ItemStats
