import { TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip'

import useStyles from './EditableText.styles'

interface EditableTextProps {
  value: string
  disabled: boolean
  onChange: (event: any) => void
}

const EditableText: React.FC<EditableTextProps> = (props) => {
  const { value, disabled, onChange } = props
  const [isText, setIsText] = useState(true)
  const classes = useStyles()

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
