import { TextField, TextFieldProps, Typography } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'

import useStyles from './EditableText.styles'

interface EditableTextProps {
  id: string
  className: string
  textFieldClass: string
  textClass?: string
  value: string | number
  disabled: boolean
  tooltip?: string | ReactNode
  disableInteractiveTooltip?: boolean
  tooltipClass?: string
  textWidth?: number
  editWidth?: number
  type?: TextFieldProps['type']
  onChange: (event: any) => void
}

const EditableText: React.FC<EditableTextProps> = (props) => {
  const {
    id,
    className,
    textClass,
    textFieldClass,
    value,
    disabled,
    onChange,
    tooltip = '',
    disableInteractiveTooltip = false,
    tooltipClass = '',
    textWidth = 0,
    editWidth = 12,
    type = 'text'
  } = props
  const [isText, setIsText] = useState(true)
  const [_value, setValue] = useState(value)
  const { classes } = useStyles()

  useEffect(() => {
    setValue(value)
  }, [value])

  const onDoubleClick = () => {
    if (isText && !disabled) {
      setIsText(false)
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
        <Tooltip PopperProps={{ className: tooltipClass }} title={tooltip} disableInteractive={disableInteractiveTooltip} placement="top-start">
          <Typography onDoubleClick={onDoubleClick} className={`${classes.textMode}${textClass ? ' ' + textClass : ''}`}>
            <span>{_value}</span>
          </Typography>
        </Tooltip>
      ) : (
        <TextField
          id={id}
          className={textFieldClass}
          value={_value}
          type={type}
          disabled={disabled}
          onChange={internalOnChange}
          onDoubleClick={onDoubleClick}
          onKeyDown={onEnter}
          onBlur={onBlur}
          variant="outlined"
          size="small"
          autoFocus
          onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
            event.target.select()
          }}
          sx={{
            width: `${editWidth}em`
          }}
        />
      )}
    </div>
  )
}

export default EditableText
