import React from 'react'

import useStyles from './TaperedRule.styles'

const TaperedRule: React.FC = () => {
  const { classes } = useStyles()
  return (
    <svg height="5" width="100%" viewBox="0 0 600 2.4" className={`${classes.taperedRule} tapered-rule`}>
      <polyline points="0,0 600,2.4 0,5"></polyline>
    </svg>
  )
}

export default TaperedRule
