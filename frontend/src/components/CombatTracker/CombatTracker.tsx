import { withStyles } from 'tss-react/mui'
import { Button, LinearProgress, Paper, TextField, Typography } from '@mui/material'
import { Container, Draggable } from 'react-smooth-dnd'
import List from '@mui/material/List'
import { arrayMoveImmutable } from 'array-move'
import ListItem from '@mui/material/ListItem'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import CurrentTurnIcon from '@mui/icons-material/ArrowForwardIos'
import ListItemIcon from '@mui/material/ListItemIcon'
import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { combatTrackerState } from 'recoil/atoms'
import _ from 'lodash'
import classNames from 'classnames/bind'

import Autocomplete from '@mui/material/Autocomplete'
import useStyles from './CombatTracker.styles'
import DeleteButton from 'components/DeleteButton'
import AddCharacterInput, { CharacterInput } from './AddCharacterInput'
import { Character, CharacterType, Condition } from 'interfaces'
import EditableText from './EditableText'
import { ConditionToIconMap } from './Conditions'

const replaceItemAtIndex = <T,>(arr: T[], index: number, newValue: T) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

const parseConditions = (character: Character) => {
  let conditions = [...character.conditions]

  conditions = isBloodied(character) ? setCondition(conditions, Condition.Bloodied) : removeCondition(conditions, Condition.Bloodied)
  conditions = isDead(character) ? setCondition(conditions, Condition.Dead) : removeCondition(conditions, Condition.Dead)

  return conditions
}

const isDead = (character: Character) => {
  return character.current_hit_points <= 0
}

const isBloodied = (character: Character) => {
  return character.current_hit_points < character.orig_hit_points / 2
}

const setCondition = (conditions: Condition[], addCondition: Condition[] | Condition) => {
  let newConditions = [...conditions]
  if (_.isArray(addCondition) && addCondition.includes(Condition.Dead)) {
    newConditions = [Condition.Dead]
  } else if (_.isArray(addCondition)) {
    newConditions = newConditions.concat(addCondition)
  } else {
    if (addCondition === Condition.Dead) {
      newConditions = [Condition.Dead]
    } else {
      newConditions.push(addCondition)
    }
  }
  return _.uniq(newConditions)
}

const removeCondition = (conditions: Condition[], condition: Condition) => {
  return _.uniq(_.without(conditions, condition))
}

const BorderLinearProgress = withStyles(LinearProgress, (theme) => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: theme.palette.primary.dark
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.status.blood
  }
}))

const AutoCompleteItem = withStyles(Paper, (theme) => ({
  root: {
    '& .MuiAutocomplete-listbox': {
      "& .MuiAutocomplete-option[aria-selected='true']": {
        background: theme.palette.secondary.main,
        '&.Mui-focused': {
          background: theme.palette.secondary.main
        }
      }
    },
    '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
      background: theme.palette.primary.dark
    }
  }
}))

export const CombatTracker: React.FC = () => {
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const currentCombat = useRecoilValue(combatTrackerState)
  const setCurrentCombat = useSetRecoilState(combatTrackerState)
  const [combatOngoing, setCombatOngoing] = useState(false)
  const [currentTurn, _setCurrentTurn] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)

  const setCurrentTurn = (next: boolean) => {
    if (next) {
      if (currentTurn === currentCombat.characters.length - 1) {
        _setCurrentTurn(0)
        setCurrentRound(currentRound + 1)
      } else {
        _setCurrentTurn(currentTurn + 1)
      }
    } else {
      if (currentTurn === 0) {
        _setCurrentTurn(currentCombat.characters.length - 1)
        if (currentRound > 1) {
          setCurrentRound(currentRound - 1)
        }
      } else {
        _setCurrentTurn(currentTurn - 1)
      }
    }
  }

  const onSort = () => {
    setCurrentCombat((combat) => {
      const sortedCharacters = _.orderBy(
        [...combat.characters],
        [
          (character: Character) => {
            return character.init
          }
        ],
        'desc'
      )
      return {
        ...combat,
        characters: sortedCharacters
      }
    })
  }

  const onChangeCharacterInit = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        init: parseInt(event.target.value) || 0
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onChangeCharacterAC = (index: number) => (value: string) => {
    setCurrentCombat((combat) => {
      const AC = parseInt(value)
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        AC: AC || 0
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onChangeCharacterHP = (index: number) => (value: string) => {
    setCurrentCombat((combat) => {
      const newMaxHP = parseInt(value)
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        orig_hit_points: newMaxHP || 0
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onChangeCharacterName = (index: number) => (value: string) => {
    setCurrentCombat((combat) => {
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        name: value
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onStoreCharacterDamage = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        damage: event.target.value
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onDrop = ({ removedIndex, addedIndex }: { removedIndex: any; addedIndex: any }) => {
    setCurrentCombat((combat) => {
      return {
        ...combat,
        characters: arrayMoveImmutable(combat.characters, removedIndex, addedIndex)
      }
    })
  }

  const onAddCharacter = (type: CharacterType) => (characterInput: CharacterInput) => {
    setCurrentCombat((combat) => {
      const charactersCopy = [...combat.characters]

      const index = _.findIndex(charactersCopy, (_character) => {
        return _character.init < characterInput.init
      })
      const indexToInsert = index >= 0 ? index : charactersCopy.length
      charactersCopy.splice(indexToInsert, 0, {
        init: characterInput.init,
        AC: characterInput.AC,
        name: characterInput.name,
        orig_hit_points: characterInput.hp,
        current_hit_points: characterInput.hp,
        damage: '',
        conditions: [],
        type
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onDeleteCharacter = (index: number) => () => {
    setCurrentCombat((combat) => {
      const charactersCopy = [...combat.characters]
      charactersCopy.splice(index, 1)
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onDamageCharacter = (index: number) => (event: any) => {
    if (event.keyCode === 13) {
      setCurrentCombat((combat) => {
        const character = combat.characters[index]
        const HPafterDamage = character.current_hit_points + parseInt(character.damage)
        const HPinBound = HPafterDamage >= 0 ? (HPafterDamage > character.orig_hit_points ? character.orig_hit_points : HPafterDamage) : 0

        const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
          ...character,
          conditions: parseConditions({
            ...character,
            current_hit_points: HPinBound
          }),
          current_hit_points: HPinBound,
          damage: '' // reset stored damage
        })
        return {
          ...combat,
          characters: charactersCopy
        }
      })
    }
  }

  const onRemoveCondition = (index: number, condition: Condition) => (event: any) => {
    if (event.button === 1 && ![Condition.Dead, Condition.Bloodied].includes(condition)) {
      // Mouse middle button
      setCurrentCombat((combat) => {
        const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
          ...combat.characters[index],
          conditions: removeCondition(combat.characters[index].conditions, condition)
        })
        return {
          ...combat,
          characters: charactersCopy
        }
      })
    }
  }

  const onSetCondition = (index: number) => (event: any, conditions: Condition[]) => {
    setCurrentCombat((combat) => {
      const toRemove = _.first(_.difference(combat.characters[index].conditions, conditions))
      let newConditions = setCondition(combat.characters[index].conditions, conditions)
      if (toRemove) {
        newConditions = removeCondition(combat.characters[index].conditions, toRemove)
      }
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        conditions: newConditions
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  return (
    <>
      <div className={`${classes.root}`}>
        {!combatOngoing ? (
          <Button variant="contained" color="primary" onClick={onSort} className={`${classes.sortButton}`}>
            Sort by init
          </Button>
        ) : (
          <Typography
            variant="body2"
            sx={{
              flex: '1 1 auto',
              textAlign: 'end'
            }}
          >
            <span
              style={{
                fontSize: '1.2em'
              }}
            >
              Round
            </span>
            <Typography
              variant="caption"
              sx={{
                fontSize: '2em',
                margin: '0 0 0 .1em'
              }}
            >
              {currentRound}
            </Typography>
            <br />
            <Typography variant="caption" sx={{ fontSize: '0.8em' }}>
              Time elapsed {currentRound * 6 - 6} seconds
            </Typography>
          </Typography>
        )}
        <List>
          <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
            {currentCombat.characters.map((character, index) => {
              return (
                <Draggable key={index}>
                  <ListItem
                    dense
                    disableGutters
                    disabled={character.conditions.includes(Condition.Dead)}
                    className={cx({
                      [classes.listItem]: true,
                      [classes.listItemCurrent]: currentTurn === index && combatOngoing,
                      [classes.listItemBloodied]: character.conditions.includes(Condition.Bloodied),
                      [classes.listItemDead]: character.conditions.includes(Condition.Dead),
                      [classes.listItemPlayer]: character.type === CharacterType.Player,
                      [classes.listItemNPC]: character.type === CharacterType.NPC,
                      [classes.listItemPlayerBloodied]:
                        (character.type === CharacterType.Player || character.type === CharacterType.NPC) && character.conditions.includes(Condition.Bloodied)
                    })}
                  >
                    {combatOngoing && (
                      <ListItemIcon className={`${character.conditions.includes(Condition.Dead) ? '' : 'drag-handle'} ${classes.dragIconContainer}`}>
                        {currentTurn === index ? <CurrentTurnIcon fontSize="large" /> : <span style={{ width: '1.5em' }}>&nbsp;</span>}
                      </ListItemIcon>
                    )}
                    {!combatOngoing && (
                      <>
                        <ListItemIcon className={`${character.conditions.includes(Condition.Dead) ? '' : 'drag-handle'} ${classes.dragIconContainer}`}>
                          <DragHandleIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemIcon className={`${classes.deleteIconContainer}`}>
                          <DeleteButton onClick={onDeleteCharacter(index)} />
                        </ListItemIcon>
                      </>
                    )}
                    <EditableText
                      id={`character-ac-${index}`}
                      tooltip={`AC ${character.AC}`}
                      className={`${classes.editableTextField}`}
                      textfieldClass={`${classes.editableTextField}`}
                      value={character.AC}
                      textWidth={25}
                      editWidth={4}
                      disabled={character.conditions.includes(Condition.Dead)}
                      onChange={onChangeCharacterAC(index)}
                    />
                    <TextField
                      id={`character-init-${index}`}
                      className={`${classes.textField} ${classes.initField}`}
                      value={character.init}
                      label="init"
                      disabled={character.conditions.includes(Condition.Dead)}
                      onChange={onChangeCharacterInit(index)}
                      variant="outlined"
                      size="small"
                    />
                    <EditableText
                      id={`character-name-${index}`}
                      tooltip={character.name}
                      className={`${classes.editableTextField}`}
                      textfieldClass={`${classes.editableTextField}`}
                      value={character.name}
                      textWidth={120}
                      editWidth={10}
                      disabled={character.conditions.includes(Condition.Dead)}
                      onChange={onChangeCharacterName(index)}
                      key={index}
                    />
                    <EditableText
                      id={`character-hp-${index}`}
                      tooltip={`HP ${character.current_hit_points} / ${character.orig_hit_points}`}
                      className={`${classes.editableTextField}`}
                      textfieldClass={`${classes.editableTextField}`}
                      value={character.current_hit_points}
                      textWidth={30}
                      editWidth={4}
                      disabled={false}
                      onChange={onChangeCharacterHP(index)}
                    />
                    <div className={classes.hpBarContainer}>
                      <BorderLinearProgress
                        className={classes.hpBar}
                        variant="determinate"
                        value={Math.round((character.current_hit_points / character.orig_hit_points) * 100)}
                      />
                    </div>
                    <TextField
                      id={`character-hit-points-${index}`}
                      className={`${classes.textField} ${classes.hpField}`}
                      value={character.damage}
                      onChange={onStoreCharacterDamage(index)}
                      onKeyDown={onDamageCharacter(index)}
                      variant="outlined"
                      size="small"
                    />
                    <Typography
                      className={cx({
                        [classes.conditionList]: true,
                        [classes.player]: character.type === CharacterType.Player,
                        [classes.npc]: character.type === CharacterType.NPC,
                        [classes.enemy]: character.type === CharacterType.Enemy
                      })}
                    >
                      &nbsp;
                      {character.conditions.map((condition, index) => {
                        return (
                          <React.Fragment key={index}>
                            <span onMouseUp={onRemoveCondition(index, condition)}>{ConditionToIconMap[condition] || null}</span>
                          </React.Fragment>
                        )
                      })}
                    </Typography>
                    <Autocomplete
                      id={`conditions-${index}`}
                      multiple
                      clearOnBlur
                      disabled={character.conditions.includes(Condition.Dead)}
                      disableClearable
                      value={_.without(character.conditions, Condition.Dead, Condition.Bloodied)}
                      className={`${classes.autocomplete}`}
                      options={_.without(Object.values(Condition), Condition.Dead, Condition.Bloodied) as Condition[]}
                      onChange={onSetCondition(index)}
                      getOptionLabel={(option) => option.replaceAll('_', ' ')}
                      style={{ width: 300 }}
                      PaperComponent={AutoCompleteItem}
                      renderInput={(params) => <TextField {...params} label="Conditions" variant="outlined" size="small" />}
                    />
                  </ListItem>
                </Draggable>
              )
            })}
          </Container>
        </List>
        {!combatOngoing && (
          <>
            <AddCharacterInput onAdd={onAddCharacter(CharacterType.Enemy)}>Add Enemy</AddCharacterInput>
            <AddCharacterInput onAdd={onAddCharacter(CharacterType.NPC)}>Add NPC</AddCharacterInput>
            <AddCharacterInput onAdd={onAddCharacter(CharacterType.Player)} requireHp={false}>
              Add Player
            </AddCharacterInput>
          </>
        )}
      </div>
      <div className={`${classes.actionsContainer}`}>
        {combatOngoing ? (
          <Button variant="contained" color="warning" onClick={() => setCombatOngoing(false)}>
            End combat
          </Button>
        ) : (
          <Button variant="contained" onClick={() => setCombatOngoing(true)}>
            Start combat
          </Button>
        )}
        {combatOngoing && (
          <>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                setCurrentTurn(false)
              }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                setCurrentTurn(true)
              }}
            >
              Next
            </Button>
          </>
        )}
        <div className={`${classes.actionsSpread}`}></div>
        {combatOngoing && (
          <Button
            variant="contained"
            onClick={() => {
              setCurrentRound(1)
              _setCurrentTurn(0)
            }}
          >
            Reset combat
          </Button>
        )}
        <Button variant="contained">Save combat</Button>
      </div>
    </>
  )
}

export default CombatTracker
