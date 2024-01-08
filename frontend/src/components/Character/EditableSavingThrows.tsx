import { Button, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import _, { capitalize } from 'lodash'
import { AbilityScores, FifthESRDService } from 'domain/services/FifthESRDService'
import { CharacterCardContext } from 'services/context'
import { defaultSavingThrows } from 'services/defaults'
import { objectWithoutEmptyOrUndefined } from 'utils/utils'
import CardTitle from './CardTitle'

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
  textField: {
    flex: '0 1 7em'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  }
}))

interface EditableSavingThrowsProps {
  className?: string
  editMode?: boolean
  presentationMode?: boolean
}

const EditableSavingThrows: React.FC<EditableSavingThrowsProps> = (props) => {
  const { editMode = false, presentationMode = false, className = '' } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)

  const characterSavingThrows = character.saving_throws.reduce((_savingThrows, proficiency) => {
    const proficiencyName = FifthESRDService.parseProficiencyName(proficiency)
    if (proficiencyName) {
      _savingThrows[proficiencyName] = proficiency.value.toString()
    }
    return _savingThrows
  }, {} as { [key in AbilityScores]: string })

  const [savingThrows, setSavingThrows] = useState({
    ...defaultSavingThrows,
    ...characterSavingThrows
  })

  const { classes } = useStyles()

  useEffect(() => {
    const characterSavingThrows = character.saving_throws.reduce((_savingThrows, proficiency) => {
      const proficiencyName = FifthESRDService.parseProficiencyName(proficiency)
      if (proficiencyName) {
        _savingThrows[proficiencyName] = proficiency.value.toString()
      }
      return _savingThrows
    }, {} as { [key in AbilityScores]: string })

    setSavingThrows({
      ...defaultSavingThrows,
      ...characterSavingThrows
    })
  }, [character.saving_throws])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeValue = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value.toString()) || ''
    setSavingThrows((_savingThrows) => {
      // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      return { ..._.cloneDeep(_savingThrows), [key]: newValue }
    })
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    const newSavingThrows = FifthESRDService.convertSavingThrowsToProficiencies(objectWithoutEmptyOrUndefined(savingThrows))
    const hasChanged = !_.isEqual(character.saving_throws, newSavingThrows)
    if (hasChanged) {
      setCharacter(character.clone({ saving_throws: FifthESRDService.convertSavingThrowsToProficiencies(objectWithoutEmptyOrUndefined(savingThrows)) }))
    }
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <div className={classes.baseStat} onDoubleClick={onDoubleClick}>
          <span className={`${classes.statHeader}`}>Saving Throws</span>
          <span className={classes.statValue}>{character.saving_throws_label}</span>
        </div>
      ) : (
        <>
          <CardTitle>Saving Throws</CardTitle>
          <div className={classes.editor}>
            {Object.entries(savingThrows).map(([name, value], index) => {
              return (
                <TextField
                  key={index}
                  className={classes.textField}
                  value={value}
                  type="tel"
                  label={name
                    .replaceAll('_', ' ')
                    .split(' ')
                    .map((part) => capitalize(part))
                    .join(' ')}
                  onChange={onChangeValue(name)}
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

export default EditableSavingThrows
