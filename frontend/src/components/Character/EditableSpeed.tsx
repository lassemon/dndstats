import { Button, TextField, TextFieldProps } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import Character from 'domain/entities/Character'
import _ from 'lodash'
import { Speed } from 'domain/services/FifthESRDService'
import { objectWithoutEmptyOrUndefined } from 'utils/utils'

const defaultSpeed = {
  ...Object.values(Speed).reduce((accumulator, speedKey) => {
    accumulator[speedKey] = ''
    return accumulator
  }, {} as Character['speed'] & {})
}

export const useStyles = makeStyles()((theme) => ({
  root: {
    cursor: 'pointer'
  },
  editor: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4em',
    alignItems: 'baseline',
    margin: '0 0 0.8em 0'
  },
  row: {
    display: 'flex',
    gap: '0.4em',
    alignItems: 'center'
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
    marginInlineStart: '0.5em'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  }
}))

interface EditableSpeedProps {
  id?: string
  className?: string
  textFieldClass?: string
  textClass?: string
  character: Character
  valueLabel?: string | number
  textWidth?: number
  editWidth?: number
  type?: TextFieldProps['type']
  editMode?: boolean
  onChange: (speed: Character['speed']) => void
}

const EditableSpeed: React.FC<EditableSpeedProps> = (props) => {
  const { id, character, editMode = false, className = '', textFieldClass = '', onChange } = props
  const [isText, setIsText] = useState(!editMode)
  const [_speed, setSpeed] = useState({ ...defaultSpeed, ...character.speed })
  const { classes } = useStyles()

  useEffect(() => {
    setSpeed({ ...defaultSpeed, ...character.speed })
  }, [character.speed])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeValue = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed((speed) => {
      return { ..._.cloneDeep(speed), [key]: event.target.value } // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
    })
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    onChange(objectWithoutEmptyOrUndefined<typeof _speed>(_speed))
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <div className={classes.baseStat} onDoubleClick={onDoubleClick}>
          <span className={classes.statHeader}>Speed</span>
          <span className={classes.statValue}>{character.speed_label}</span>
        </div>
      ) : (
        <>
          <div className={classes.editor}>
            {Object.values(Speed).map((key, index) => {
              return (
                <div key={index} className={classes.row}>
                  <TextField
                    id={id}
                    className={textFieldClass}
                    value={_speed[key]}
                    type="text"
                    label={key}
                    onChange={onChangeValue(key)}
                    variant="outlined"
                    size="small"
                    onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                      event.target.select()
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </div>
              )
            })}
          </div>
          <div className={classes.buttonsContainer}>
            {!editMode && (
              <Button variant="contained" size="small" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button variant="contained" size="small" onClick={onSave}>
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default EditableSpeed
