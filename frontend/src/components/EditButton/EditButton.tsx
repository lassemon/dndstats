import { IconButton, IconButtonProps } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  button: {
    color: theme.palette.secondary.main
  }
}))

interface EditButtonProps extends IconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ScreenshotButton: React.FC<EditButtonProps> = (props) => {
  const { onClick } = props
  const { classes } = useStyles()
  return (
    <IconButton {...props} aria-label="screenshot" className={classes.button} onClick={onClick}>
      <EditIcon fontSize="large" />
    </IconButton>
  )
}

export default ScreenshotButton
