import statblockparch from 'assets/statblockparch.jpg'
import OrangeBorder from 'components/OrangeBorder'
import React from 'react'

import useStyles from './StatsContainer.styles'

interface StatsContainerProps {
  className?: string
  size?: 'small' | 'normal'
}

export const StatsContainer: React.FC<StatsContainerProps> = (props) => {
  const { children, className = '', size = 'normal' } = props
  const { classes } = useStyles()
  const divStyle = {
    backgroundImage: 'url(' + statblockparch + ')'
  }

  return (
    <div className={`${classes.root} ${className} stats-container`}>
      <OrangeBorder />
      <div className={`${classes.content} stats-background`} style={divStyle}>
        <div className={size === 'normal' ? classes.margins : classes.marginsSmall}>{children}</div>
      </div>
      <OrangeBorder />
    </div>
  )
}

export default StatsContainer
