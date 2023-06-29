import { Button, InputAdornment, TextField } from '@material-ui/core'
import React, { useState } from 'react'

import useStyles from './AddEnemyInput.styles'

const blankEnemy = { init: '', name: '', hp: '' }
export interface Enemy {
  init: number
  name: string
  hp: number
}

interface AddEnemyInputProps {
  onAddEnemy: (enemy: Enemy) => void
}

const AddEnemyInput: React.FC<AddEnemyInputProps> = (props) => {
  const { onAddEnemy } = props
  const [enemyInput, setEnemyInput] = useState(blankEnemy)
  const [addEnemyInputError, setAddEnemyInputError] = useState(false)
  const classes = useStyles()

  const internalOnAddEnemy = () => {
    const hp = parseInt(enemyInput.hp) | 0
    if (!hp || hp <= 0) {
      setAddEnemyInputError(true)
    } else {
      onAddEnemy({
        init:
          parseInt(enemyInput.init) && parseInt(enemyInput.init) > 0
            ? parseInt(enemyInput.init)
            : 0,
        name: enemyInput.name,
        hp: parseInt(enemyInput.hp) | 0
      })

      setEnemyInput({ ...blankEnemy })
    }
  }

  const onEnemyInitChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.persist()
    setEnemyInput((enemy) => {
      return {
        ...enemy,
        init: event.target.value
      }
    })
  }

  const onEnemyNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.persist()
    setEnemyInput((enemy) => {
      return {
        ...enemy,
        name: event.target.value
      }
    })
  }

  const onEnemyHpChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.persist()
    setAddEnemyInputError(false)
    setEnemyInput((enemy) => {
      return {
        ...enemy,
        hp: event.target.value
      }
    })
  }

  return (
    <div className={classes.addContainer}>
      <TextField
        id="enemy-init-input"
        className={`${classes.textField} ${classes.initField}`}
        value={enemyInput.init}
        onChange={onEnemyInitChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">init</InputAdornment>
        }}
        variant="outlined"
      />
      <TextField
        id="enemy-name-input"
        className={`${classes.textField} ${classes.nameField}`}
        value={enemyInput.name}
        onChange={onEnemyNameChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">name</InputAdornment>
        }}
        variant="outlined"
      />
      <TextField
        id="enemy-hp-input"
        className={`${classes.textField} ${classes.hpField}`}
        value={enemyInput.hp}
        error={addEnemyInputError}
        onChange={onEnemyHpChange}
        onBlur={() => setAddEnemyInputError(false)}
        InputProps={{
          startAdornment: <InputAdornment position="start">HP</InputAdornment>
        }}
        variant="outlined"
      />
      <Button variant="contained" color="primary" onClick={internalOnAddEnemy}>
        Add Enemy
      </Button>
    </div>
  )
}

export default AddEnemyInput
