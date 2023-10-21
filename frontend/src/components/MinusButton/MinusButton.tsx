import { IconButton } from '@material-ui/core'
import MinusIcon from '@material-ui/icons/IndeterminateCheckBox'
import React from 'react'

import useStyles from './MinusButton.styles'

interface MinusButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const MinusButton: React.FC<MinusButtonProps> = (props) => {
  const { onClick } = props
  const classes = useStyles()
  return (
    <IconButton
      aria-label="minus"
      className={classes.minusButton}
      onClick={onClick}
    >
      <MinusIcon fontSize="large" />
    </IconButton>
  )
}

export default MinusButton
