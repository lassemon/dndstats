import { Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'

import useStyles from './AddCharacterInput.styles'

const blankCharacter = { init: '', name: '', hp: '' }

export interface CharacterInput {
  init: number
  name: string
  hp: number
}

interface AddCharacterInputProps {
  onAdd: (character: CharacterInput) => void
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = (props) => {
  const { onAdd } = props
  const [character, setCharacter] = useState(blankCharacter)
  const [characterInputError, setCharacterInputError] = useState(false)
  const classes = useStyles()

  const internalOnAdd = () => {
    const hp = parseInt(character.hp) | 0
    if (!hp || hp <= 0) {
      setCharacterInputError(true)
    } else {
      onAdd({
        init: parseInt(character.init) && parseInt(character.init) > 0 ? parseInt(character.init) : 0,
        name: character.name,
        hp: parseInt(character.hp) | 0
      })

      setCharacter({ ...blankCharacter })
    }
  }

  const onEnemyInitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.persist()
    setCharacter((character) => {
      return {
        ...character,
        init: event.target.value
      }
    })
  }

  const onEnemyNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.persist()
    setCharacter((character) => {
      return {
        ...character,
        name: event.target.value
      }
    })
  }

  const onEnemyHpChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.persist()
    setCharacterInputError(false)
    setCharacter((character) => {
      return {
        ...character,
        hp: event.target.value
      }
    })
  }

  return (
    <div className={classes.addContainer}>
      <TextField
        id="character-init-input"
        className={`${classes.textField} ${classes.initField}`}
        value={character.init}
        placeholder="init"
        onChange={onEnemyInitChange}
        variant="outlined"
      />
      <TextField
        id="character-name-input"
        className={`${classes.textField} ${classes.nameField}`}
        value={character.name}
        placeholder="name"
        onChange={onEnemyNameChange}
        variant="outlined"
      />
      <TextField
        id="character-hp-input"
        className={`${classes.textField} ${classes.hpField}`}
        value={character.hp}
        error={characterInputError}
        placeholder="max HP"
        onChange={onEnemyHpChange}
        onBlur={() => setCharacterInputError(false)}
        variant="outlined"
      />
      <Button variant="contained" color="primary" onClick={internalOnAdd}>
        {props.children}
      </Button>
    </div>
  )
}

export default AddCharacterInput
