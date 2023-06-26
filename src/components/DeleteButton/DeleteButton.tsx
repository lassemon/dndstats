import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'

import useStyles from './DeleteButton.styles'

interface DeleteButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { onClick } = props
  const classes = useStyles()
  return (
    <IconButton
      aria-label="delete"
      className={classes.deleteButton}
      onClick={onClick}
    >
      <DeleteIcon fontSize="large" />
    </IconButton>
  )
}

export default DeleteButton
