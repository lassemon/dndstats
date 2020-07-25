import React from 'react'

import useStyles from './OrangeBorder.styles'

const OrangeBorder: React.FC = () => {
  const classes = useStyles()
  return <hr className={classes.orangeBorder} />
}

export default OrangeBorder
