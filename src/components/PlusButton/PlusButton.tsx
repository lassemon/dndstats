import { IconButton } from '@mui/material'
import PlusIcon from '@mui/icons-material/AddBox'
import React from 'react'

import useStyles from './PlusButton.styles'

interface PlusButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const PlusButton: React.FC<PlusButtonProps> = (props) => {
  const { onClick } = props
  const classes = useStyles()
  return (
    <IconButton
      aria-label="plus"
      className={classes.plusButton}
      onClick={onClick}
      size="large">
      <PlusIcon fontSize="large" />
    </IconButton>
  );
}

export default PlusButton
