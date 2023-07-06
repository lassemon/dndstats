import { Button, LinearProgress, TextField, Typography, withStyles } from '@material-ui/core'
import { Container, Draggable } from 'react-smooth-dnd'
import List from '@material-ui/core/List'
import { arrayMoveImmutable } from 'array-move'
import ListItem from '@material-ui/core/ListItem'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { combatTrackerState } from 'recoil/atoms'
import _ from 'lodash'
import classNames from 'classnames/bind'

import Autocomplete from '@material-ui/lab/Autocomplete'
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

const BorderLinearProgress = withStyles((theme) => ({
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
}))(LinearProgress)

export const CombatTracker: React.FC = () => {
  const classes = useStyles()
  const cx = classNames.bind(classes)
  const currentCombat = useRecoilValue(combatTrackerState)
  const setCurrentCombat = useSetRecoilState(combatTrackerState)

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

  const onChangeCharacterName = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        name: event.target.value
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

  const onAddCharacter = (characterInput: CharacterInput) => {
    setCurrentCombat((combat) => {
      const charactersCopy = [...combat.characters]

      const index = _.findIndex(charactersCopy, (_character) => {
        return _character.init < characterInput.init
      })
      const indexToInsert = index >= 0 ? index : charactersCopy.length
      charactersCopy.splice(indexToInsert, 0, {
        init: characterInput.init,
        name: characterInput.name,
        orig_hit_points: characterInput.hp,
        current_hit_points: characterInput.hp,
        damage: '',
        conditions: [],
        type: CharacterType.Enemy
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onAddPC = (pc: CharacterInput) => {
    setCurrentCombat((combat) => {
      const charactersCopy = [...combat.characters]

      const index = _.findIndex(charactersCopy, (_character) => {
        return _character.init < pc.init
      })
      const indexToInsert = index >= 0 ? index : charactersCopy.length
      charactersCopy.splice(indexToInsert, 0, {
        init: pc.init,
        name: pc.name,
        orig_hit_points: pc.hp,
        current_hit_points: pc.hp,
        damage: '',
        conditions: [],
        type: CharacterType.PC
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
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        conditions: setCondition(combat.characters[index].conditions, conditions)
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  return (
    <div className={`${classes.root}`}>
      <Button variant="contained" color="primary" onClick={onSort} className={`${classes.sortButton}`}>
        Sort by init
      </Button>
      <List>
        <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
          {currentCombat.characters.map((character, key) => {
            return (
              <Draggable key={key}>
                <ListItem
                  dense
                  disableGutters
                  disabled={character.conditions.includes(Condition.Dead)}
                  className={cx({
                    [classes.listItem]: true,
                    [classes.listItemBloodied]: character.conditions.includes(Condition.Bloodied),
                    [classes.listItemDead]: character.conditions.includes(Condition.Dead),
                    [classes.listItemPC]: character.type === CharacterType.PC,
                    [classes.listItemPCBloodied]: character.type === CharacterType.PC && character.conditions.includes(Condition.Bloodied)
                  })}
                >
                  <ListItemIcon className={`${character.conditions.includes(Condition.Dead) ? '' : 'drag-handle'} ${classes.dragIconContainer}`}>
                    <DragHandleIcon fontSize="large" />
                  </ListItemIcon>
                  <ListItemIcon className={`${classes.deleteIconContainer}`}>
                    <DeleteButton onClick={onDeleteCharacter(key)} />
                  </ListItemIcon>
                  <TextField
                    id="character-init"
                    className={`${classes.textField} ${classes.initField}`}
                    value={character.init}
                    label="init"
                    disabled={character.conditions.includes(Condition.Dead)}
                    onChange={onChangeCharacterInit(key)}
                    variant="outlined"
                  />
                  <EditableText
                    value={character.name}
                    disabled={character.conditions.includes(Condition.Dead)}
                    onChange={onChangeCharacterName(key)}
                    key={key}
                  />
                  <Typography className={classes.hpText}>HP {character.current_hit_points}</Typography>
                  <div className={classes.hpBarContainer}>
                    <BorderLinearProgress
                      className={classes.hpBar}
                      variant="determinate"
                      value={Math.round((character.current_hit_points / character.orig_hit_points) * 100)}
                    />
                  </div>
                  <TextField
                    id="character-hit-points"
                    className={`${classes.textField} ${classes.hpField}`}
                    value={character.damage}
                    onChange={onStoreCharacterDamage(key)}
                    onKeyDown={onDamageCharacter(key)}
                    variant="outlined"
                  />
                  <Typography className={classes.conditionList}>
                    {character.conditions.map((condition, index) => {
                      return (
                        <React.Fragment key={index}>
                          <span onMouseUp={onRemoveCondition(key, condition)}>{ConditionToIconMap[condition] || null}</span>
                        </React.Fragment>
                      )
                    })}
                  </Typography>
                  <Autocomplete
                    id="conditions"
                    multiple
                    clearOnBlur
                    disabled={character.conditions.includes(Condition.Dead)}
                    disableClearable
                    value={_.without(character.conditions, Condition.Dead, Condition.Bloodied)}
                    className={`${classes.autocomplete}`}
                    options={_.without(Object.values(Condition), Condition.Dead, Condition.Bloodied) as Condition[]}
                    onChange={onSetCondition(key)}
                    getOptionLabel={(option) => option.replaceAll('_', ' ')}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Conditions" variant="outlined" />}
                  />
                </ListItem>
              </Draggable>
            )
          })}
        </Container>
      </List>
      <AddCharacterInput onAdd={onAddCharacter}>Add Character</AddCharacterInput>
      <AddCharacterInput onAdd={onAddPC}>Add PC</AddCharacterInput>
    </div>
  )
}

export default CombatTracker
