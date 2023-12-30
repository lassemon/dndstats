import { TextField, TextFieldProps } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  root: {
    cursor: 'pointer'
  },
  baseStat: {
    textTransform: 'capitalize'
  },
  statHeader: {
    color: theme.status.blood,
    fontSize: '1.1em',
    lineHeight: '1.2em',
    fontWeight: 'bold',
    flexBasis: '16.6%',
    textAlign: 'center'
  },
  statValue: {
    color: theme.status.blood,
    fontSize: '1em',
    fontFamily: '"Helvetica", "Arial", sans-serif',
    flexBasis: '16.6%',
    textTransform: 'capitalize',
    display: 'inline-block',
    marginInlineStart: '0.5em',
    whiteSpace: 'nowrap'
  }
}))

interface EditableKeyValueProps {
  id?: string
  className?: string
  textFieldClass?: string
  textClass?: string
  label: string
  value: string | number
  valueLabel?: string | number
  disabled?: boolean
  tooltip?: string | ReactNode
  disableInteractiveTooltip?: boolean
  tooltipClass?: string
  tooltipPlacement?: TooltipProps['placement']
  tooltipMaxWidth?: string
  textWidth?: number
  editWidth?: number
  type?: TextFieldProps['type']
  editMode?: boolean
  onChange: (value: string | number) => void
}

const EditableKeyValue: React.FC<EditableKeyValueProps> = (props) => {
  const {
    id,
    className = '',
    textFieldClass = '',
    label,
    value,
    valueLabel,
    disabled = false,
    onChange,
    tooltip = '',
    disableInteractiveTooltip = false,
    tooltipClass = '',
    tooltipMaxWidth = '300',
    editWidth = 12,
    type = 'text',
    tooltipPlacement = 'top-start',
    editMode = false
  } = props

  const EditableKeyValueTooltip =
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

  const onBlur = () => {
    if (!isText && !disabled) {
      onChange(_value)
      if (!editMode) {
        setIsText(true)
      }
    }
  }

  const internalOnChange = (event: any) => {
    setValue(event.target.value)
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
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <EditableKeyValueTooltip
          PopperProps={{ className: tooltipClass }}
          title={tooltip}
          disableInteractive={disableInteractiveTooltip}
          placement={tooltipPlacement}
        >
          <div className={`baseStat ${classes.baseStat}`} onDoubleClick={onDoubleClick}>
            <span className={classes.statHeader}>{label}</span>
            <span className={classes.statValue}>{valueLabel ? valueLabel : _value}</span>
          </div>
        </EditableKeyValueTooltip>
      ) : (
        <TextField
          id={id}
          className={textFieldClass}
          value={_value}
          type={type}
          label={label}
          disabled={disabled}
          onChange={internalOnChange}
          onBlur={onBlur}
          onDoubleClick={onDoubleClick}
          onKeyDown={onEnter}
          variant="outlined"
          size="small"
          //autoFocus here breaks the open edit mode in monsterstats because blur gets triggered
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

export default EditableKeyValue
