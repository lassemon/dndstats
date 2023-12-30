import { Button, TextFieldProps } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import _ from 'lodash'
import EditableKeyValue from './EditableKeyValue'
import { defaultAbilityScores } from 'services/defaults'
import { objectWithoutEmptyOrUndefined } from 'utils/utils'
import { AbilityScores } from 'domain/services/FifthESRDService'
import { CharacterCardContext } from 'services/context'

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
  abilityScores: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > div': {
      display: 'flex',
      flex: '1 1 50%',
      padding: '0.2em 0',
      '& > div': {
        marginInlineStart: '0',
        textAlign: 'center',
        flex: '1'
      }
    }
  },
  abilityScore: {
    '.baseStat': {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  }
}))

interface EditableAbilityScoresProps {
  className?: string
  textFieldClass?: string
  textClass?: string
  valueLabel?: string | number
  textWidth?: number
  editWidth?: number
  type?: TextFieldProps['type']
  editMode?: boolean
}

const formatEditableAbilityScores = (_abilityScores: { [key in AbilityScores]: string | number }): typeof defaultAbilityScores => {
  const tempAbilityScores = objectWithoutEmptyOrUndefined<typeof _abilityScores>(_abilityScores)

  for (const key in tempAbilityScores) {
    if (tempAbilityScores.hasOwnProperty(key)) {
      if (typeof tempAbilityScores[key as keyof typeof tempAbilityScores] === 'string') {
        const oldValue = tempAbilityScores[key as keyof typeof tempAbilityScores]
        if (oldValue) {
          tempAbilityScores[key as keyof typeof tempAbilityScores] = parseInt(oldValue.toString())
        }
      }
    }
  }

  return tempAbilityScores as typeof defaultAbilityScores
}

const EditableAbilityScores: React.FC<EditableAbilityScoresProps> = (props) => {
  const { editMode = false, className = '', editWidth = 3.5 } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)

  const characterAbilityScores = {
    ...{
      strength: character.strength || '',
      dexterity: character.dexterity || '',
      constitution: character.constitution || '',
      intelligence: character.intelligence || '',
      wisdom: character.wisdom || '',
      charisma: character.charisma || ''
    }
  }

  const [abilityScores, setAbilityScores] = useState({
    ...defaultAbilityScores,
    ...characterAbilityScores
  })
  const { classes } = useStyles()

  useEffect(() => {
    const characterAbilityScores = {
      ...{
        strength: character.strength || '',
        dexterity: character.dexterity || '',
        constitution: character.constitution || '',
        intelligence: character.intelligence || '',
        wisdom: character.wisdom || '',
        charisma: character.charisma || ''
      }
    }
    /*const hasChanged = !_.isEqual(character.abilityScores, abilityScores)
    console.log('hasChanged', hasChanged)
    console.log('character.abilityScores', character.abilityScores)
    console.log('abilityScores', abilityScores)*/
    setAbilityScores({
      ...defaultAbilityScores,
      ...characterAbilityScores
    })
  }, [character.strength, character.dexterity, character.constitution, character.intelligence, character.wisdom, character.charisma])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  // DO NOT DO THIS, CAUSES INFINITE LOOP
  /*useEffect(() => {
        //setCharacter(character.clone(formatEditableAbilityScores(abilityScores)))
    // this is AN ARSESTA
  }, [abilityScores])*/

  const onChangeValue = (key: string) => (value: string | number) => {
    const newValue = parseInt(value.toString())
    setAbilityScores((_abilityScores) => {
      // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      const newAbilityScores = { ..._.cloneDeep(_abilityScores), [key]: newValue }
      setCharacter(character.clone(formatEditableAbilityScores(newAbilityScores)))
      return newAbilityScores
    })
  }

  const onSave = () => {
    setCharacter(character.clone(formatEditableAbilityScores(abilityScores)))
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      <>
        <div className={classes.abilityScores}>
          <div>
            {character.strength && (
              <EditableKeyValue
                id="strength"
                className={classes.abilityScore}
                label="STR"
                value={abilityScores.strength}
                valueLabel={character.strenght_label}
                onChange={onChangeValue('strength')}
                editWidth={editWidth}
                editMode={!isText}
              />
            )}
            {character.dexterity && (
              <EditableKeyValue
                id="dexterity"
                className={classes.abilityScore}
                label="DEX"
                value={abilityScores.dexterity}
                valueLabel={character.dexterity_label}
                onChange={onChangeValue('dexterity')}
                editWidth={editWidth}
                editMode={!isText}
              />
            )}
            {character.constitution && (
              <EditableKeyValue
                id="constitution"
                className={classes.abilityScore}
                label="CON"
                value={abilityScores.constitution}
                valueLabel={character.constitution_label}
                onChange={onChangeValue('constitution')}
                editWidth={editWidth}
                editMode={!isText}
              />
            )}
          </div>
          <div>
            {character.intelligence && (
              <EditableKeyValue
                id="intelligence"
                className={classes.abilityScore}
                label="INT"
                value={abilityScores.intelligence}
                valueLabel={character.intelligence_label}
                onChange={onChangeValue('intelligence')}
                editWidth={editWidth}
                editMode={!isText}
              />
            )}
            {character.wisdom && (
              <EditableKeyValue
                id="wisdom"
                className={classes.abilityScore}
                label="WIS"
                value={abilityScores.wisdom}
                valueLabel={character.wisdom_label}
                onChange={onChangeValue('wisdom')}
                editWidth={editWidth}
                editMode={!isText}
              />
            )}
            {character.charisma && (
              <EditableKeyValue
                id="charisma"
                className={classes.abilityScore}
                label="CHA"
                value={abilityScores.charisma}
                valueLabel={character.charisma_label}
                onChange={onChangeValue('charisma')}
                editWidth={editWidth}
                editMode={!isText}
              />
            )}
          </div>
        </div>
        {!isText && editMode && (
          <div className={classes.buttonsContainer}>
            <Button variant="contained" size="small" onClick={onSave}>
              Save
            </Button>
          </div>
        )}
      </>
    </div>
  )
}

export default EditableAbilityScores
