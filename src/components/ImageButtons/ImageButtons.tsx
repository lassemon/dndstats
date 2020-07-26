import { Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import PublishIcon from '@material-ui/icons/Publish'
import React from 'react'

import useStyles from './ImageButtons.styles'

interface ImageButtonsProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDeleteImage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
}

export const ImageButtons: React.FC<ImageButtonsProps> = (props) => {
  const { onUpload, onDeleteImage } = props
  const classes = useStyles()

  return (
    <div className={classes.bottomButtons}>
      <Button component="label">
        Upload image
        <input
          type="file"
          accept="image/*"
          name="image"
          id="file"
          onChange={onUpload}
          style={{
            display: "none",
          }}
        />
        <PublishIcon fontSize="large" />
      </Button>
      <Button onClick={onDeleteImage} className={classes.deleteButton}>
        Clear image
        <DeleteIcon fontSize="large" />
      </Button>
    </div>
  )
}

export default ImageButtons
