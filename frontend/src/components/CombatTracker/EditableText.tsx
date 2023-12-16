import { TextField, TextFieldProps, Typography } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

import useStyles from './EditableText.styles'

interface EditableTextProps {
  id: string
  className?: string
  textFieldClass?: string
  textClass?: string
  value: string | number
  disabled?: boolean
  tooltip?: string | ReactNode
  disableInteractiveTooltip?: boolean
  tooltipClass?: string
  tooltipPlacement?: TooltipProps['placement']
  tooltipMaxWidth?: string
  textWidth?: number
  editWidth?: number
  type?: TextFieldProps['type']
  onChange: (event: any) => void
}

const EditableText: React.FC<EditableTextProps> = (props) => {
  const {
    id,
    className = '',
    textClass = '',
    textFieldClass = '',
    value,
    disabled = false,
    onChange,
    tooltip = '',
    disableInteractiveTooltip = false,
    tooltipClass = '',
    tooltipMaxWidth = '300',
    textWidth = 30,
    editWidth = 12,
    type = 'text',
    tooltipPlacement = 'top-start'
  } = props

  const EditableTextTooltip =
    tooltipMaxWidth !== '300'
      ? styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
          [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: tooltipMaxWidth
          }
        })
      : Tooltip

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
    <div className={`editableTextField ${className}`}>
      {isText ? (
        <EditableTextTooltip
          PopperProps={{ className: tooltipClass }}
          title={tooltip}
          disableInteractive={disableInteractiveTooltip}
          placement={tooltipPlacement}
        >
          <Typography onDoubleClick={onDoubleClick} className={`${classes.textMode}${textClass ? ' ' + textClass : ''}`}>
            <span>{_value}</span>
          </Typography>
        </EditableTextTooltip>
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
