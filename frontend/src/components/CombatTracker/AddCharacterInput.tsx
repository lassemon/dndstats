import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useState } from 'react'

import useStyles from './AddCharacterInput.styles'
import { PlayerType } from 'interfaces'

const blankCharacter = { init: '', armorClass: '', name: '', hit_points: '', player_type: PlayerType.Enemy }

export interface CharacterInput {
  init: number
  armorClass: number
  name: string
  hit_points: number
  player_type: `${PlayerType}`
}

interface AddCharacterInputProps {
  onAdd: (character: CharacterInput) => void
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = (props) => {
  const { onAdd } = props
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

  const onChangePlayerType = (event: SelectChangeEvent<PlayerType>) => {
    setCharacter((character) => {
      return {
        ...character,
        player_type: event.target.value as PlayerType
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
      <FormControl size="small">
        <InputLabel id="type-select">Player Type</InputLabel>
        <Select
          size="small"
          labelId={`type`}
          id="type-select"
          value={character.player_type}
          label="Player type"
          onChange={onChangePlayerType}
          sx={{
            '&': {
              width: '8.9em'
            }
          }}
        >
          <MenuItem value={PlayerType.Player}>Player</MenuItem>
          <MenuItem value={PlayerType.NPC}>NPC</MenuItem>
          <MenuItem value={PlayerType.Enemy}>Enemy</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={internalOnAdd} sx={{ whiteSpace: 'nowrap' }}>
        Add Player
      </Button>
      {props.children}
    </div>
  )
}

export default AddCharacterInput
