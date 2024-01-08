import { Button, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Senses } from 'interfaces'
import _, { capitalize } from 'lodash'
import { CharacterCardContext } from 'services/context'
import { defaultSenses } from 'services/defaults'
import { objectWithoutEmptyOrUndefined } from 'utils/utils'
import CardTitle from './CardTitle'

export const useStyles = makeStyles()((theme) => ({
  root: {
    cursor: 'pointer'
  },
  editor: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4em',
    alignItems: 'baseline',
    margin: '0.6em 0 0.8em 0'
  },
  row: {
    width: '100%',
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
  },
  autocomplete: {
    '& .MuiAutocomplete-tag': {
      textTransform: 'capitalize',
      height: 'auto',
      '& .MuiChip-label': {
        whiteSpace: 'normal'
      }
    },
    '& .MuiInputLabel-animated': {
      transform: 'translate(14px, -9px) scale(0.75)'
    },
    '& legend': {
      maxWidth: '100%'
    }
  }
}))

interface EditableSensesProps {
  className?: string
  editMode?: boolean
  presentationMode?: boolean
}

const EditableSenses: React.FC<EditableSensesProps> = (props) => {
  const { className = '', editMode = false, presentationMode } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)
  const [internalSenses, setInternalSenses] = useState({
    ...defaultSenses,
    ...character.senses
  })

  const { classes } = useStyles()

  useEffect(() => {
    setInternalSenses({
      ...defaultSenses,
      ...character.senses
    })
  }, [character.senses])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeValue = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSenses((_senses) => {
      return { ..._.cloneDeep(_senses), [key]: event.target.value } // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
    })
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    const newSenses = objectWithoutEmptyOrUndefined<typeof internalSenses>(internalSenses)
    const hasChanged = !_.isEqual(character.senses, newSenses)
    if (hasChanged) {
      const characterClone = character.clone({ senses: newSenses })
      setCharacter(characterClone)
    }
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <div className={classes.baseStat} onDoubleClick={onDoubleClick}>
          <span className={classes.statHeader}>Senses</span>
          <span className={classes.statValue}>{character.senses_label}</span>
        </div>
      ) : (
        <>
          <CardTitle>Senses</CardTitle>
          <div className={classes.editor}>
            {Object.values(Senses).map((key, index) => {
              return (
                <div key={index} className={classes.row}>
                  <TextField
                    id={key}
                    value={internalSenses[key]}
                    type="text"
                    label={key
                      .replaceAll('_', ' ')
                      .split(' ')
                      .map((part) => capitalize(part))
                      .join(' ')}
                    onChange={onChangeValue(key)}
                    onBlur={presentationMode ? undefined : onSave}
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
            {presentationMode && (
              <Button variant="contained" size="small" onClick={onSave}>
                Save
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default EditableSenses
