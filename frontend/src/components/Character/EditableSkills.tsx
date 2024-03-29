import { Button, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import _, { capitalize } from 'lodash'
import { FifthESRDService } from 'domain/services/FifthESRDService'
import { CharacterCardContext } from 'services/context'
import { defaultSkills } from 'services/defaults'
import { objectWithoutEmptyOrUndefined } from 'utils/utils'
import CardTitle from './CardTitle'
import Stat from 'components/Stat'

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
    flex: '0 1 48%'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  }
}))

interface EditableSkillsProps {
  className?: string
  editMode?: boolean
  presentationMode?: boolean
}

const EditableSkills: React.FC<EditableSkillsProps> = (props) => {
  const { editMode = false, presentationMode = false, className = '' } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)

  const characterSkills = character.skills.reduce((_skills, proficiency) => {
    const proficiencyName = FifthESRDService.parseSkillName(proficiency)
    if (proficiencyName) {
      _skills[proficiencyName] = proficiency.value.toString()
    }
    return _skills
  }, {} as { [key: string]: string })

  const [skills, setSkills] = useState({
    ...defaultSkills,
    ...characterSkills
  })

  const { classes } = useStyles()

  useEffect(() => {
    const characterSkills = character.skills.reduce((_skills, proficiency) => {
      const proficiencyName = FifthESRDService.parseSkillName(proficiency)
      if (proficiencyName) {
        _skills[proficiencyName] = proficiency.value.toString()
      }
      return _skills
    }, {} as { [key: string]: string })
    setSkills({
      ...defaultSkills,
      ...characterSkills
    })
  }, [character.skills])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeValue = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setSkills((_skills) => {
      // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      return { ..._.cloneDeep(_skills), [key]: value }
    })
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    const newSkills = FifthESRDService.convertSkillsToProficiencies(objectWithoutEmptyOrUndefined<typeof skills>(skills))
    const hasChanged = !_.isEqual(character.skills, newSkills)
    if (hasChanged) {
      setCharacter(character.clone({ skills: newSkills }))
    }
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <Stat header="Skills" value={character.skills_label} onDoubleClick={onDoubleClick} />
      ) : (
        <>
          <CardTitle>Skills</CardTitle>
          <div className={classes.editor}>
            {Object.entries(skills).map(([name, value], index) => {
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

export default EditableSkills
