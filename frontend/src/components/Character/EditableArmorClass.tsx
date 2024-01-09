import { Button, FormControl, InputLabel, MenuItem, Select, TextField, TextFieldProps } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { makeStyles } from 'tss-react/mui'
import { ArmorClassType } from 'domain/services/FifthESRDService'
import Character from 'domain/entities/Character'
import _ from 'lodash'
import { replaceItemAtIndex } from 'utils/utils'
import DeleteButton from 'components/DeleteButton'
import { CharacterCardContext } from 'services/context'
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
    margin: '0 0 0.8em 0'
  },
  row: {
    display: 'flex',
    gap: '0.4em',
    alignItems: 'center',
    flexWrap: 'wrap'
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

interface EditableArmorClassProps {
  id?: string
  className?: string
  textFieldClass?: string
  textClass?: string
  valueLabel?: string | number
  textWidth?: number
  editWidth?: number
  type?: TextFieldProps['type']
  editMode?: boolean
  presentationMode?: boolean
}

const EditableArmorClass: React.FC<EditableArmorClassProps> = (props) => {
  const { id, editMode = false, presentationMode = false, className = '', textFieldClass = '' } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)
  const [_armorClasses, setArmorClasses] = useState([...(character.armor_classes || [])])
  const { classes } = useStyles()

  useEffect(() => {
    setArmorClasses([...(character.armor_classes || [])])
  }, [character.armor_classes])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeValue = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setArmorClasses((armorClasses) => {
      let newArmorClass = _.cloneDeep(armorClasses[index]) // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      newArmorClass = { type: newArmorClass.type, value: parseInt(event.target.value) }
      if (Character.getArmorClassDetailPath(newArmorClass)) {
        _.set(newArmorClass, Character.getArmorClassNamePath(newArmorClass), '')
        _.set(newArmorClass, Character.getArmorClassIndexPath(newArmorClass), '')
      }
      return replaceItemAtIndex(armorClasses, index, newArmorClass)
    })
  }

  const onChangeType = (index: number) => (event: any) => {
    setArmorClasses((armorClasses) => {
      let newArmorClass = _.cloneDeep(armorClasses[index]) // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      newArmorClass = { type: event.target.value, value: newArmorClass.value }
      if (Character.getArmorClassDetailPath(newArmorClass)) {
        _.set(newArmorClass, Character.getArmorClassNamePath(newArmorClass), '')
        _.set(newArmorClass, Character.getArmorClassIndexPath(newArmorClass), '')
      }
      return replaceItemAtIndex(armorClasses, index, newArmorClass)
    })
  }

  const onChangeDetail = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setArmorClasses((armorClasses) => {
      const newArmorClass = _.cloneDeep(armorClasses[index]) // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      _.set(newArmorClass, Character.getArmorClassNamePath(newArmorClass), event.target.value || '')
      _.set(newArmorClass, Character.getArmorClassIndexPath(newArmorClass), (event.target.value || '').toLowerCase())
      return replaceItemAtIndex(armorClasses, index, newArmorClass)
    })
  }

  const onDelete = (index: number) => () => {
    setArmorClasses((armorClasses) => {
      const armorClassesCopy = [...armorClasses]
      armorClassesCopy.splice(index, 1)
      setCharacter(character.clone({ armor_classes: armorClassesCopy }))
      return armorClassesCopy
    })
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onAdd = () => {
    setArmorClasses((armorClasses) => {
      return [...armorClasses, { type: ArmorClassType.NATURAL, value: 10 }]
    })
    setCharacter(character.clone({ armor_classes: [..._armorClasses, { type: ArmorClassType.NATURAL, value: 10 }] }))
  }

  const onSave = () => {
    const hasChanged = !_.isEqual(character.armor_classes, _armorClasses)
    if (hasChanged) {
      setCharacter(character.clone({ armor_classes: _armorClasses }))
    }
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <div className={classes.baseStat} onDoubleClick={onDoubleClick}>
          <span className={classes.statHeader}>Armor Class</span>
          <span className={classes.statValue}>{character.armor_class_label}</span>
        </div>
      ) : (
        <div className={classes.editor}>
          <CardTitle>Armor Classes</CardTitle>
          {_armorClasses.map((armorClass, index) => {
            return (
              <div key={index} className={classes.row}>
                <DeleteButton size="small" onClick={onDelete(index)} sx={{ padding: 0 }} />
                <Tooltip title="Whatever is the highest armor class value in the list, is considered the AC of the character" placement="top-start">
                  <FormControl sx={{ m: 0, flex: '0 0 9em' }} size="small">
                    <InputLabel id="armor-class-type">Armor Class</InputLabel>
                    <Select
                      labelId={'armor-class-type'}
                      id="type-select"
                      value={armorClass.type}
                      label="Armor Class"
                      onChange={onChangeType(index)}
                      onBlur={presentationMode ? undefined : onSave}
                    >
                      {Object.values(ArmorClassType).map((value, index) => {
                        return (
                          <MenuItem key={index} value={value}>
                            {value}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Tooltip>
                <TextField
                  id={id}
                  className={textFieldClass}
                  value={armorClass.value}
                  type="text"
                  onChange={onChangeValue(index)}
                  onBlur={presentationMode ? undefined : onSave}
                  variant="outlined"
                  size="small"
                  onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                    event.target.select()
                  }}
                  sx={{
                    flex: `0 0 4em`
                  }}
                />
                {Character.getArmorClassDetailPath(armorClass) && (
                  <TextField
                    id={id}
                    className={textFieldClass}
                    value={Character.getArmorClassName(armorClass)}
                    type="text"
                    onChange={onChangeDetail(index)}
                    onBlur={presentationMode ? undefined : onSave}
                    variant="outlined"
                    size="small"
                    autoFocus={presentationMode}
                    onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                      event.target.select()
                    }}
                    sx={{
                      flex: `1 1 8em`
                    }}
                  />
                )}
              </div>
            )
          })}
          <div className={classes.buttonsContainer}>
            {!editMode && (
              <Button variant="contained" size="small" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button variant="contained" size="small" onClick={onAdd}>
              Add AC
            </Button>
            {presentationMode && (
              <Button variant="contained" size="small" onClick={onSave}>
                Save
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EditableArmorClass
