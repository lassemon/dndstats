import OrangeBorder from 'components/OrangeBorder'
import React from 'react'

import useStyles from './StatsContainer.styles'

interface StatsContainerProps {
  className?: string
}

export const StatsContainer: React.FC<StatsContainerProps> = (props) => {
  const { children, className = "" } = props
  const classes = useStyles()

  return (
    <div className={`${classes.root} ${className}`}>
      <OrangeBorder />
      <div className={classes.content}>{children}</div>
      <OrangeBorder />
    </div>
  )
}

export default StatsContainer
