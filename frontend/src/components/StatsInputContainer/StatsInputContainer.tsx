import React from 'react'

import useStyles from './StatsInputContainer.styles'

interface StatsInputContainerProps {
  className?: string
}

export const StatsInputContainer: React.FC<StatsInputContainerProps> = (props) => {
  const { children, className = '' } = props
  const { classes } = useStyles()

  return <div className={`${classes.root} ${className}`}>{children}</div>
}

export default StatsInputContainer
