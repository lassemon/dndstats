import { TextField, TextFieldProps, Typography } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

import useStyles from './EditableText.styles'
import classNames from 'classnames'

interface EditableTextProps {
  id?: string
  className?: string
  textFieldClass?: string
  textClass?: string
  label?: string
  hideLabelInTextMode?: boolean
  value: string | number
  disabled?: boolean
  tooltip?: string | ReactNode
  disableInteractiveTooltip?: boolean
  tooltipClass?: string
  tooltipPlacement?: TooltipProps['placement']
  tooltipMaxWidth?: string
  tooltipOpen?: boolean
  textWidth?: number
  editWidth?: number
  type?: TextFieldProps['type']
  editMode?: boolean
  presentationMode?: boolean
  multiline?: boolean
  onChange: (value: string | number) => void
  onOpen?: React.MouseEventHandler<HTMLSpanElement>
}

const EditableText: React.FC<EditableTextProps> = (props) => {
  const {
    id,
    className = '',
    textClass = '',
    textFieldClass = '',
    label,
    hideLabelInTextMode = false,
    value,
    disabled = false,
    onOpen,
    onChange,
    tooltip = '',
    disableInteractiveTooltip = false,
    tooltipClass = '',
    tooltipMaxWidth = '300',
    tooltipPlacement = 'top-start',
    tooltipOpen,
    editWidth,
    type = 'text',
    editMode = false,
    presentationMode = false,
    multiline = false
  } = props

  const EditableTextTooltip =
    tooltipMaxWidth !== '300'
      ? styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
          [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: tooltipMaxWidth
          }
        })
      : Tooltip

  const [isText, setIsText] = useState(!editMode)
  const [_value, setValue] = useState(value)
  const { classes } = useStyles()
  const cx = classNames.bind(classes)

  useEffect(() => {
    setValue(value)
  }, [value])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText && !disabled) {
      setIsText(false)
    }
  }

  const internalOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target
    setValue(value)
  }

  const onBlur = () => {
    if (!isText && !disabled) {
      const hasChanged = value !== _value
      if (hasChanged) {
        onChange(_value)
      }
      if (!editMode) {
        setIsText(true)
      }
    }
  }

  const onEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13) {
      if (!isText && !disabled && !editMode) {
        const hasChanged = value !== _value
        if (hasChanged) {
          onChange(_value)
        }
        setIsText(true)
      }
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <EditableTextTooltip
          PopperProps={{ className: tooltipClass }}
          title={tooltip}
          disableInteractive={disableInteractiveTooltip}
          placement={tooltipPlacement}
          open={tooltipOpen}
        >
          <Typography
            onClick={onOpen}
            onDoubleClick={onDoubleClick}
            className={cx({
              [classes.textMode]: !label,
              [classes.labelMode]: label,
              [textClass]: true
            })}
          >
            {label && !hideLabelInTextMode && <span className={classes.statHeader}>{label}</span>}
            <span className={label && !hideLabelInTextMode ? classes.statValue : ''}>{_value}</span>
          </Typography>
        </EditableTextTooltip>
      ) : (
        <TextField
          id={id}
          className={textFieldClass}
          value={_value}
          type={type}
          label={label}
          disabled={disabled}
          onChange={internalOnChange}
          onKeyDown={onEnter}
          onBlur={onBlur}
          variant="outlined"
          size="small"
          multiline={multiline}
          autoFocus={presentationMode}
          InputLabelProps={{
            shrink: true
          }}
          onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
            if (!multiline) {
              event.target.select()
            }
          }}
          sx={{
            width: `${editWidth ? `${editWidth}em` : '100%'}`
          }}
        />
      )}
    </div>
  )
}

export default EditableText
