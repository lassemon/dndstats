import { Button, Typography } from '@mui/material'
import EditableText from 'components/CombatTracker/EditableText'
import DeleteButton from 'components/DeleteButton'
import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { CharacterCardContext } from 'services/context'
import { makeStyles } from 'tss-react/mui'
import { replaceItemAtIndex } from 'utils/utils'
import CardTitle from './CardTitle'

export const useStyles = makeStyles()((theme) => ({
  root: {
    cursor: 'pointer',
    breakInside: 'avoid'
  },
  header: {
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    margin: '0',
    color: theme.status.blood,
    letterSpacing: '0.02em',
    fontVariant: 'small-caps'
  },
  actionsHeader: {
    fontSize: '1.8em',
    margin: '0.5em 0',
    borderBottom: `1px solid ${theme.status.blood}`
  },
  actionContainer: {
    margin: '0 0 0.5em 0'
  },
  actionName: {
    fontSize: '1em',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontVariant: 'small-caps',
    letterSpacing: '1px',
    color: `${theme.palette.text.primary}`,
    padding: '0 0.5em 0 0'
  },
  actionNameInput: {},
  actionDescription: {
    fontWeight: '400',
    fontSize: '1rem',
    lineHeight: '1.43',
    letterSpacing: '0.01071em',
    fontFamily: "'Noto Sans','Myriad Pro',Calibri,Helvetica,Arial,sans-serif",
    textAlign: 'start',
    whiteSpace: 'pre-wrap'
  },
  actionDescriptionBase: {
    flex: '1 1 100%'
  },
  actionDescriptionInput: {
    '& textarea': {
      fontSize: '0.8em'
    }
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4em',
    alignItems: 'flex-start',
    margin: '0 0 2em 0'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  }
}))

interface EditableSpecialAbilitiesProps {
  editMode?: boolean
  presentationMode?: boolean
}

const EditableSpecialAbilities: React.FC<EditableSpecialAbilitiesProps> = (props) => {
  const { editMode = false, presentationMode = false } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)
  const [internalSpecialAbilities, setInternalSpecialAbilities] = useState([...(character.special_abilities || [])])
  const { classes } = useStyles()

  useEffect(() => {
    setInternalSpecialAbilities([...character.special_abilities])
  }, [character.special_abilities])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeName = (index: number) => (value: string | number) => {
    setInternalSpecialAbilities((special_abilities) => {
      let newSpecialAbility = _.cloneDeep(special_abilities[index]) // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      newSpecialAbility = { ...newSpecialAbility, name: value.toString() }
      const newSpecialAbilities = replaceItemAtIndex(special_abilities, index, newSpecialAbility)
      if (!presentationMode) {
        setCharacter(character.clone({ special_abilities: newSpecialAbilities }))
      }
      return newSpecialAbilities
    })
  }

  const onChangeDescription = (index: number) => (value: string | number) => {
    setInternalSpecialAbilities((special_abilities) => {
      let newSpecialAbility = _.cloneDeep(special_abilities[index]) // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      newSpecialAbility = { ...newSpecialAbility, desc: value.toString() }
      const newSpecialAbilities = replaceItemAtIndex(special_abilities, index, newSpecialAbility)
      if (!presentationMode) {
        setCharacter(character.clone({ special_abilities: newSpecialAbilities }))
      }
      return newSpecialAbilities
    })
  }

  const onDelete = (index: number) => () => {
    setInternalSpecialAbilities((special_abilities) => {
      const specialAbilitiesCopy = [...special_abilities]
      specialAbilitiesCopy.splice(index, 1)
      setCharacter(character.clone({ special_abilities: specialAbilitiesCopy }))
      return specialAbilitiesCopy
    })
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onAdd = () => {
    setInternalSpecialAbilities((special_abilities) => {
      return [...special_abilities, { name: '', desc: '' }]
    })
    setCharacter(character.clone({ special_abilities: [...internalSpecialAbilities, { name: '', desc: '' }] }))
  }

  const onSave = () => {
    const hasChanged = !_.isEqual(character.special_abilities, internalSpecialAbilities)
    if (hasChanged) {
      setCharacter(character.clone({ special_abilities: internalSpecialAbilities }))
    }
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root}`}>
      {isText ? (
        <div onDoubleClick={onDoubleClick}>
          {internalSpecialAbilities.map((specialAbility, index) => {
            return (
              <Typography key={index} variant="body2" className={classes.actionContainer}>
                <span className={`${classes.actionName}`}>{specialAbility.name}</span>
                <span className={classes.actionDescription}>{specialAbility.desc}</span>
              </Typography>
            )
          })}
        </div>
      ) : (
        <>
          <CardTitle>Special Abilities</CardTitle>
          {internalSpecialAbilities.map((specialAbility, index) => {
            return (
              <div key={index} className={classes.row}>
                <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
                  <DeleteButton size="small" onClick={onDelete(index)} sx={{ padding: 0 }} />
                  <EditableText
                    id={'special-ability-name-' + index}
                    textFieldClass={`${classes.actionNameInput}`}
                    value={specialAbility.name}
                    label="Special Ability Name"
                    onChange={onChangeName(index)}
                    editMode={!isText}
                    presentationMode={false}
                  />
                </div>
                <EditableText
                  id={'special-ability-description-' + index}
                  className={classes.actionDescriptionBase}
                  textFieldClass={classes.actionDescriptionInput}
                  value={specialAbility.desc}
                  label="Special Ability Description"
                  onChange={onChangeDescription(index)}
                  editMode={!isText}
                  presentationMode={false}
                  multiline={true}
                />
              </div>
            )
          })}
        </>
      )}
      {!isText && (
        <div className={classes.buttonsContainer}>
          {!editMode && (
            <Button variant="contained" size="small" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button variant="contained" size="small" onClick={onAdd}>
            Add Special Ability
          </Button>
          {presentationMode && (
            <Button variant="contained" size="small" onClick={onSave}>
              Save
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default EditableSpecialAbilities
