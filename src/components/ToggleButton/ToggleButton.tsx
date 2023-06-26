import { IconButton } from '@material-ui/core'
import ToggleOffIcon from '@material-ui/icons/ToggleOff'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import React, { useState } from 'react'

import useStyles from './ToggleButton.styles'

interface ToggleButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ToggleButton: React.FC<ToggleButtonProps> = (props) => {
  const { onClick } = props
  const classes = useStyles()
  const [value, setValue] = useState(true)

  const internalOnClick = (event: any) => {
    setValue(!value)
    onClick(event)
  }

  return (
    <IconButton
      aria-label="minus"
      className={`${value ? classes.onButton: classes.offButton}`}
      onClick={internalOnClick}
    >
      {value ?
        <ToggleOnIcon fontSize="large" />
        :
        <ToggleOffIcon fontSize="large" />
      }
    </IconButton>
  )
}

export default ToggleButton
