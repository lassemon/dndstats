import React from 'react'
import { IconButton, IconButtonProps } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { makeStyles } from 'tss-react/mui'

import { SvgIconComponent } from '@mui/icons-material'

export const useStyles = makeStyles()((theme) => ({
  deleteButton: {
    color: theme.status.blood
  }
}))

interface DeleteButtonProps extends IconButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  Icon?: SvgIconComponent
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { onClick, size, Icon, ...passProps } = props
  const { classes } = useStyles()
  return Icon ? (
    <IconButton {...passProps} aria-label="delete" className={classes.deleteButton} onClick={onClick}>
      <Icon fontSize={size ? size : 'large'} />
    </IconButton>
  ) : (
    <IconButton {...passProps} aria-label="delete" className={classes.deleteButton} onClick={onClick}>
      <DeleteIcon fontSize={size ? size : 'large'} />
    </IconButton>
  )
}

export default DeleteButton
