import { IconButton, IconButtonProps } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'

import useStyles from './DeleteButton.styles'

interface DeleteButtonProps extends IconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { onClick } = props
  const { classes } = useStyles()
  return (
    <IconButton {...props} aria-label="delete" className={classes.deleteButton} onClick={onClick}>
      <DeleteIcon fontSize="large" />
    </IconButton>
  )
}

export default DeleteButton
