import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'

import useStyles from './AddCharacterInput.styles'

const blankCharacter = { init: '', armorClass: '', name: '', hit_points: '' }

export interface CharacterInput {
  init: number
  armorClass: number
  name: string
  hit_points: number
}

interface AddCharacterInputProps {
  onAdd: (character: CharacterInput) => void
  text: string
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = (props) => {
  const { onAdd, text } = props
  const [character, setCharacter] = useState(blankCharacter)
  const [characterInputError, setCharacterInputError] = useState(false)
  const { classes } = useStyles()

  const internalOnAdd = () => {
    if (!character.name) {
      setCharacterInputError(true)
    } else {
      onAdd({
        init: parseInt(character.init) && parseInt(character.init) > 0 ? parseInt(character.init) : 0,
        armorClass: parseInt(character.armorClass) || 0,
        name: character.name,
        hit_points: parseInt(character.hit_points) || 0
      })

      setCharacter({ ...blankCharacter })
    }
  }

  const onCharacterACChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.persist()
    setCharacter((character) => {
      return {
        ...character,
        armorClass: event.target.value
      }
    })
  }

  const onCharacterInitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.persist()
    setCharacter((character) => {
      return {
        ...character,
        init: event.target.value
      }
    })
  }

  const onCharacterNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.persist()
    setCharacter((character) => {
      return {
        ...character,
        name: event.target.value
      }
    })
  }

  const onCharacterHpChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.persist()
    setCharacterInputError(false)
    setCharacter((character) => {
      return {
        ...character,
        hit_points: event.target.value
      }
    })
  }

  return (
    <div className={classes.addContainer}>
      <TextField
        className={`${classes.textField} ${classes.initField}`}
        value={character.armorClass}
        placeholder="AC"
        onChange={onCharacterACChange}
        variant="standard"
      />
      <TextField
        className={`${classes.textField} ${classes.initField}`}
        value={character.init}
        placeholder="init"
        onChange={onCharacterInitChange}
        variant="standard"
      />
      <TextField
        className={`${classes.textField} ${classes.nameField}`}
        value={character.name}
        error={characterInputError}
        placeholder="name"
        onChange={onCharacterNameChange}
        variant="standard"
      />
      <TextField
        className={`${classes.textField} ${classes.hpField}`}
        value={character.hit_points}
        placeholder="HP"
        onChange={onCharacterHpChange}
        onBlur={() => setCharacterInputError(false)}
        variant="standard"
      />
      <Button variant="contained" color="primary" onClick={internalOnAdd}>
        {text}
      </Button>
      {props.children}
    </div>
  )
}

export default AddCharacterInput
