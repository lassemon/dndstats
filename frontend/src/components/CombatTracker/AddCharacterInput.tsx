import { Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useState } from 'react'

import useStyles from './AddCharacterInput.styles'
import { CharacterType } from 'interfaces'

const blankCharacter = { init: '', armorClass: '', name: '', hit_points: '', player_type: CharacterType.Enemy }

export interface CharacterInput {
  init: number
  armorClass: number
  name: string
  hit_points: number
  player_type: `${CharacterType}`
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
        armorClass: parseInt(character.armorClass) || 10,
        name: character.name,
        hit_points: parseInt(character.hit_points) || 10,
        player_type: character.player_type
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

  const onChangePlayerType = (event: SelectChangeEvent<CharacterType>) => {
    console.log('changing player type', event)
    setCharacter((character) => {
      return {
        ...character,
        player_type: event.target.value as CharacterType
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
      <Select
        size="small"
        labelId={`type`}
        id="type-select"
        value={character.player_type}
        label="Age"
        onChange={onChangePlayerType}
        sx={{
          '&': {
            width: '8.9em'
          }
        }}
      >
        <MenuItem value={CharacterType.Player}>Player</MenuItem>
        <MenuItem value={CharacterType.NPC}>NPC</MenuItem>
        <MenuItem value={CharacterType.Enemy}>Enemy</MenuItem>
      </Select>
      <Button variant="contained" color="primary" onClick={internalOnAdd}>
        {text}
      </Button>
      {props.children}
    </div>
  )
}

export default AddCharacterInput
