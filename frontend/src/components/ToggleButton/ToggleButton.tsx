import { IconButton, IconButtonProps } from '@mui/material'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import React, { useState } from 'react'

import useStyles from './ToggleButton.styles'

interface ToggleButtonProps extends IconButtonProps {
  selected?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ToggleButton: React.FC<ToggleButtonProps> = (props) => {
  const { onClick, selected, ...passProps } = props
  const { classes } = useStyles()
  const [value, setValue] = useState<boolean>(typeof selected !== 'undefined' ? selected : true)

  const internalOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setValue(!value)
    onClick(event)
  }

  return (
    <IconButton {...passProps} aria-label="minus" className={`${value ? classes.onButton : classes.offButton}`} onClick={internalOnClick}>
      {value ? <ToggleOnIcon fontSize="large" /> : <ToggleOffIcon fontSize="large" />}
    </IconButton>
  )
}

export default ToggleButton
