import { IconButton } from '@mui/material'
import MinusIcon from '@mui/icons-material/IndeterminateCheckBox'
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
