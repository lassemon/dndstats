import { IconButton } from '@mui/material'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import React, { useState } from 'react'

import useStyles from './ToggleButton.styles'

interface ToggleButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ToggleButton: React.FC<ToggleButtonProps> = (props) => {
  const { onClick } = props
  const { classes } = useStyles()
  const [value, setValue] = useState(true)

  const internalOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setValue(!value)
    onClick(event)
  }

  return (
    <IconButton aria-label="minus" className={`${value ? classes.onButton : classes.offButton}`} onClick={internalOnClick}>
      {value ? <ToggleOnIcon fontSize="large" /> : <ToggleOffIcon fontSize="large" />}
    </IconButton>
  )
}

export default ToggleButton
