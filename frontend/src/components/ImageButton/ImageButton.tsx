import { IconButton, IconButtonProps } from '@mui/material'
import PhotoIcon from '@mui/icons-material/Photo'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  imageButton: {
    color: theme.palette.secondary.light
  }
}))

interface ImageButtonProps extends IconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ImageButton: React.FC<ImageButtonProps> = (props) => {
  const { onClick, size } = props
  const { classes } = useStyles()
  return (
    <IconButton {...props} aria-label="delete" className={classes.imageButton} onClick={onClick}>
      <PhotoIcon fontSize={size ? size : 'large'} />
    </IconButton>
  )
}

export default ImageButton
