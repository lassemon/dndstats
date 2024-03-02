import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PublishIcon from '@mui/icons-material/Publish'
import React from 'react'

import useStyles from './ImageButtons.styles'

interface ImageButtonsProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDeleteImage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const ImageButtons: React.FC<ImageButtonsProps> = (props) => {
  const { onUpload, onDeleteImage } = props
  const { classes } = useStyles()

  const internalOnUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()
    onUpload(event)
    event.target.value = ''
  }

  return (
    <div className={classes.bottomButtons}>
      <Button component="label" sx={{ paddingLeft: 0 }}>
        Upload image
        <input
          type="file"
          accept="image/*"
          name="image"
          id="file"
          onChange={internalOnUpload}
          style={{
            display: 'none'
          }}
        />
        <PublishIcon fontSize="large" />
      </Button>
      <Button onClick={onDeleteImage} className={classes.deleteButton} sx={{ paddingRight: 0 }}>
        Clear image
        <DeleteIcon fontSize="large" />
      </Button>
    </div>
  )
}

export default ImageButtons
