import { TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'

import useStyles from './EditableText.styles'

interface EditableTextProps {
  id: string
  className: string
  textfieldClass: string
  value: string | number
  disabled: boolean
  tooltip?: string
  textWidth?: number
  editWidth?: number
  onChange: (event: any) => void
}

const EditableText: React.FC<EditableTextProps> = (props) => {
  const { id, className, textfieldClass, value, disabled, onChange, tooltip = '', textWidth = 0, editWidth = 12 } = props
  const [isText, setIsText] = useState(true)
  const [_value, setValue] = useState(value)
  const { classes } = useStyles()
  const focusRef = React.createRef<HTMLDivElement>()

  useEffect(() => {
    setValue(value)
  }, [value])

  const onDoubleClick = () => {
    if (isText && !disabled) {
      setIsText(false)

      setTimeout(() => {
        if (focusRef.current) {
          // does not work, this is always null
          focusRef.current.focus()
        }
      }, 300)
    }
  }

  const internalOnChange = (event: any) => {
    setValue(event.target.value)
  }

  const onBlur = () => {
    if (!isText && !disabled) {
      onChange(_value)
      setIsText(true)
    }
  }

  const onEnter = (event: any) => {
    if (event.keyCode === 13) {
      if (!isText && !disabled) {
        onChange(_value)
        setIsText(true)
      }
    }
  }

  return (
    <div className={className} style={{ flex: `0 1 ${textWidth}px` }}>
      {isText ? (
        <Tooltip title={tooltip} placement="top-start">
          <Typography onDoubleClick={onDoubleClick} className={classes.textMode}>
            {_value}
          </Typography>
        </Tooltip>
      ) : (
        <TextField
          id={id}
          className={textfieldClass}
          value={_value}
          placeholder="name"
          disabled={disabled}
          onChange={internalOnChange}
          onDoubleClick={onDoubleClick}
          onKeyDown={onEnter}
          onBlur={onBlur}
          variant="outlined"
          size="small"
          ref={focusRef}
          sx={{
            width: `${editWidth}em`
          }}
        />
      )}
    </div>
  )
}

export default EditableText
