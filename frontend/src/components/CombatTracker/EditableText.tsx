import { TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'

import useStyles from './EditableText.styles'

interface EditableTextProps {
  value: string
  disabled: boolean
  onChange: (event: any) => void
}

const EditableText: React.FC<EditableTextProps> = (props) => {
  const { value, disabled, onChange } = props
  const [isText, setIsText] = useState(true)
  const { classes } = useStyles()

  const onDoubleClick = () => {
    if (isText && !disabled) {
      setIsText(false)
    }
  }

  const onBlur = () => {
    if (!isText && !disabled) {
      setIsText(true)
    }
  }

  return (
    <>
      {isText ? (
        <Tooltip title={value} placement="top-start">
          <Typography onDoubleClick={onDoubleClick} className={classes.nameText}>
            {value}
          </Typography>
        </Tooltip>
      ) : (
        <TextField
          id="character-name"
          className={`${classes.textField} ${classes.nameField}`}
          value={value}
          placeholder="name"
          disabled={disabled}
          onChange={onChange}
          onDoubleClick={onDoubleClick}
          onBlur={onBlur}
          variant="outlined"
        />
      )}
    </>
  )
}

export default EditableText
