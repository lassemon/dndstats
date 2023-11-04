import { withStyles } from 'tss-react/mui'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Popover,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { Container, Draggable } from 'react-smooth-dnd'
import List from '@mui/material/List'
import { arrayMoveImmutable } from 'array-move'
import ListItem from '@mui/material/ListItem'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import CurrentTurnIcon from '@mui/icons-material/ArrowForwardIos'
import ListItemIcon from '@mui/material/ListItemIcon'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { combatTrackerState } from 'recoil/atoms'
import _ from 'lodash'
import classNames from 'classnames/bind'

import Autocomplete from '@mui/material/Autocomplete'
import useStyles from './CombatTracker.styles'
import DeleteButton from 'components/DeleteButton'
import AddCharacterInput, { CharacterInput } from './AddCharacterInput'
import { Character, CharacterType, Condition, DamageType } from 'interfaces'
import { defaultCharacter } from 'services/defaults'
import EditableText from './EditableText'
import { ConditionToIconMap, calculateEffect, calculateEffectTooltip, getConditionEffects } from './Conditions'
import AddBox from '@mui/icons-material/AddBox'
import Settings from '@mui/icons-material/Settings'
import { TransitionProps } from '@mui/material/transitions'

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
  return character.current_hit_points + character.temporary_hit_points < character.max_hp / 2
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

const removeConditions = (conditions: Condition[], toRemove: Condition[]) => {
  return _.uniq(_.without(conditions, ...toRemove))
}

const BorderLinearProgress = withStyles(LinearProgress, (theme) => {
  return {
    root: {
      height: 10,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor: theme.palette.secondary.main
    },
    bar: {
      borderRadius: 5,
      backgroundColor: theme.status.blood
    },
    bar1Buffer: {
      border: '1px solid black'
    },
    dashed: {
      backgroundImage: 'none'
    },
    buffer: {
      borderRadius: 5,
      backgroundColor: theme.palette.grey[400]
    }
  }
})

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const CombatTracker: React.FC = () => {
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const [currentCombat, setCurrentCombat] = useRecoilState(combatTrackerState)
  const [combatOngoing, setCombatOngoing] = useState(false)
  const [currentTurn, _setCurrentTurn] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [settingsAnchors, setSettingsAnchors] = React.useState<Array<HTMLButtonElement | null>>(currentCombat.characters.map(() => null))
  const [incomingDamages, setIncomingDamages] = React.useState<string[]>(currentCombat.characters.map(() => ''))
  const [incomingTempHPs, setIncomingTempHPs] = React.useState<string[]>(currentCombat.characters.map(() => ''))
  const [incomingRegenerations, setIncomingRegenerations] = React.useState<string[]>(currentCombat.characters.map(() => ''))
  const [regenDialogsOpen, setRegenDialogsOpen] = React.useState<boolean[]>(currentCombat.characters.map(() => false))

  useEffect(() => {
    const currentCharacter = currentCombat.characters[currentTurn]
    const canRegenerate = currentCharacter.current_hit_points < currentCharacter.max_hp
    if (currentCharacter.regeneration > 0 && canRegenerate) {
      setRegenDialogsOpen((regenDialogs) => {
        return replaceItemAtIndex<boolean>(regenDialogs, currentTurn, true)
      })
    }
  }, [currentTurn, currentCombat.characters])

  useEffect(() => {
    setRegenDialogsOpen((regenDialogs) => {
      return regenDialogs.map(() => false)
    })
    setIncomingDamages((damages) => {
      return damages.map(() => '')
    })
    setIncomingTempHPs((tempHPs) => {
      return tempHPs.map(() => '')
    })
  }, [currentCombat.characters])

  useEffect(() => {
    _setCurrentTurn(0)
  }, [currentCombat.characters.length])

  const closeRegenDialog = (index: number, regenCharacter?: boolean) => {
    if (regenCharacter === true) {
      onRegenerateCharacter(index)
    } else {
      setRegenDialogsOpen((regenDialogs) => {
        return replaceItemAtIndex<boolean>(regenDialogs, currentTurn, false)
      })
    }
  }

  const openSettings = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchors((anchors) => {
      return replaceItemAtIndex<HTMLButtonElement | null>(anchors, index, event.currentTarget)
    })
  }

  const closeSettings = (index: number) => {
    setSettingsAnchors((anchors) => {
      return replaceItemAtIndex<HTMLButtonElement | null>(anchors, index, null)
    })
  }

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

  const clearCombat = (type?: CharacterType) => {
    setCurrentCombat((combat) => {
      const charactersCopy = type ? [...combat.characters].filter((character) => character.type !== type) : []
      return {
        ...combat,
        characters: charactersCopy
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
        ...defaultCharacter,
        init: characterInput.init,
        AC: characterInput.AC,
        name: characterInput.name,
        max_hp: characterInput.hp,
        hp_cap: characterInput.hp,
        current_hit_points: characterInput.hp,
        conditions: [],
        resistances: [],
        type,
        effects: {}
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

  const onChangeCharacterHP = (index: number) => (value: string) => {
    setCurrentCombat((combat) => {
      const newMaxHP = parseInt(value)
      if (
        newMaxHP !== combat.characters[index].max_hp ||
        newMaxHP !== combat.characters[index].hp_cap ||
        newMaxHP !== combat.characters[index].current_hit_points
      ) {
        const characterCopy = {
          ...combat.characters[index],
          max_hp: newMaxHP || 0,
          hp_cap: newMaxHP || 0,
          current_hit_points: newMaxHP || 0,
          temporary_hit_points: 0,
          temp_hp_placeholder: ''
        }
        const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
          ...characterCopy,
          conditions: parseConditions({
            ...characterCopy
          })
        })
        return {
          ...combat,
          characters: charactersCopy
        }
      } else {
        return combat
      }
    })
  }

  const onWriteTemporaryHitPoints = (index: number) => (event: any) => {
    setIncomingTempHPs((tempHPs) => {
      return replaceItemAtIndex<string>(tempHPs, index, event.target.value)
    })
  }

  const onChangeTemporaryHitPoints = (index: number) => (event: any, reason?: string) => {
    if (event.keyCode === 13 || reason === 'backdropClick') {
      setCurrentCombat((combat) => {
        const character = combat.characters[index]
        let newTempHp = character.temporary_hit_points
        //console.log(character)

        const incomingTempHp = parseInt(incomingTempHPs[index]) || 0
        //const decreasingTempHp = character.temporary_hit_points > 0 && character.temporary_hit_points > incomingTempHp
        //const increasingTempHp = character.temporary_hit_points < incomingTempHp
        const changingTempHp = incomingTempHp !== 0
        //const characterIsMissingHp = character.current_hit_points + character.temporary_hit_points < character.max_hp

        /*
        console.log('incomingTempHp', incomingTempHp)
        console.log('decreasingTempHp', decreasingTempHp)
        console.log('increasingTempHp', increasingTempHp)
        console.log('changingTempHp', increasingTempHp)
        console.log('characterIsMissingHp', characterIsMissingHp)
        */

        if (changingTempHp) {
          newTempHp = incomingTempHp
        }

        const characterCopy = {
          ...character,
          temporary_hit_points: newTempHp,
          hp_cap: character.max_hp + newTempHp,
          temp_hp_placeholder: ''
        }
        const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
          ...characterCopy,
          conditions: parseConditions({
            ...characterCopy
          })
        })
        return {
          ...combat,
          characters: charactersCopy
        }
      })
    }
  }

  const onWriteRegeneration = (index: number) => (event: any) => {
    setIncomingRegenerations((regenations) => {
      return replaceItemAtIndex<string>(regenations, index, event.target.value)
    })
  }

  const onChangeRegeneration = (index: number) => (event: any, reason?: string) => {
    if (event.keyCode === 13 || reason === 'backdropClick') {
      setCurrentCombat((combat) => {
        const character = combat.characters[index]
        const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
          ...character,
          regeneration: parseInt(incomingRegenerations[index]) || 0
        })

        return {
          ...combat,
          characters: charactersCopy
        }
      })
    }
  }

  const onRegenerateCharacter = (index: number) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index]
      const incomingRegeneration = character.regeneration || 0
      let newHp = character.current_hit_points + incomingRegeneration
      if (newHp > character.max_hp) {
        newHp = character.max_hp
      }

      const characterCopy = {
        ...character,
        current_hit_points: newHp
      }
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...characterCopy,
        conditions: parseConditions({
          ...characterCopy
        })
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onSetIncomingDamage = (index: number) => (event: any) => {
    setIncomingDamages((damages) => {
      return replaceItemAtIndex<string>(damages, index, event.target.value || '')
    })
  }

  const onDamageOrHealCharacter = (index: number) => (event: any) => {
    if (event.keyCode === 13) {
      setCurrentCombat((combat) => {
        const character = { ...combat.characters[index] }
        let newHp = character.current_hit_points
        let newTempHp = character.temporary_hit_points
        //let newMaxHp = character.max_hp
        let changeToHp = 0
        let changeToTempHp = 0

        const incomingHpChange = parseInt(incomingDamages[index]) || 0
        const canIncreaseHp = character.current_hit_points + character.temporary_hit_points < character.hp_cap
        const canDecreaseHp = character.current_hit_points + character.temporary_hit_points > 0
        const canChangeHp = canIncreaseHp || canDecreaseHp
        const canDecreaseTempHp = character.temporary_hit_points > 0

        /*
        console.log(character)
        console.log('incomingHpChange', incomingHpChange)
        console.log('canIncreaseHp', canIncreaseHp)
        console.log('canDecreaseHp', canDecreaseHp)
        console.log('canChangeHp', canChangeHp)
        console.log('canDecreaseTempHp', canDecreaseTempHp)
        */

        if (canDecreaseTempHp && incomingHpChange < 0) {
          changeToTempHp = incomingHpChange
          if (character.temporary_hit_points + changeToTempHp < 0) {
            const overflowDamage = character.temporary_hit_points + changeToTempHp
            changeToHp = overflowDamage
          }
        } else if (canChangeHp) {
          changeToHp = incomingHpChange
        }

        const tryingToIncreaseHp = changeToHp > 0
        const tryingToDecreaseHp = changeToHp < 0
        const tryingToDecreaseTempHp = changeToTempHp < 0
        /*
        console.log('tryingToIncreaseHp', tryingToIncreaseHp)
        console.log('tryingToDecreaseHp', tryingToDecreaseHp)
        console.log('tryingToDecreaseTempHp', tryingToDecreaseTempHp)
        */

        if ((tryingToIncreaseHp && canIncreaseHp) || (tryingToDecreaseHp && canDecreaseHp)) {
          newHp = character.current_hit_points + changeToHp
          if (newHp > character.max_hp) {
            newHp = character.max_hp
          }
          if (newHp < 0) {
            newHp = 0
          }
        }
        if (tryingToDecreaseTempHp && canDecreaseTempHp) {
          newTempHp = character.temporary_hit_points + changeToTempHp
          //newMaxHp = character.max_hp + changeToTempHp
          //console.log('newTempHp', newTempHp)
          if (newTempHp < 0) {
            newTempHp = 0
            //newMaxHp = character.current_hit_points
          }
        }

        /*
        if (newHp + newTempHp > newMaxHp) {
          console.log('---')

          console.log('newMaxHp', newMaxHp)
          console.log('newHp', newHp)
          console.log('newTempHp', newTempHp)
          newMaxHp = character.max_hp + newTempHp
          newHp = newMaxHp - newTempHp
          console.log('---')
        }
        */

        //console.log('newHp', newHp)
        //console.log('newTempHp', newTempHp)

        const damagedCharacter = {
          ...character,
          //max_hp: newMaxHp,
          hp_cap: character.max_hp + newTempHp,
          current_hit_points: newHp,
          temporary_hit_points: newTempHp,
          temp_hp_placeholder: String(newTempHp)
        }

        const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
          ...damagedCharacter,
          conditions: parseConditions({
            ...damagedCharacter
          })
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
        const newConditions = removeCondition(combat.characters[index].conditions, condition)
        const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
          ...combat.characters[index],
          conditions: newConditions,
          effects: getConditionEffects(newConditions)
        })
        return {
          ...combat,
          characters: charactersCopy
        }
      })
    }
  }

  const onChangeCondition = (index: number) => (event: any, conditions: Condition[]) => {
    setCurrentCombat((combat) => {
      const toRemove = _.difference(combat.characters[index].conditions, conditions).filter((condition) => {
        return condition !== Condition.Bloodied && condition !== Condition.Dead
      })
      let newConditions = setCondition(combat.characters[index].conditions, conditions)
      if (!_.isEmpty(toRemove)) {
        newConditions = removeConditions(combat.characters[index].conditions, toRemove)
      }
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        conditions: newConditions,
        effects: getConditionEffects(newConditions)
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onChangeResistance = (index: number) => (event: any, resistances: DamageType[]) => {
    setCurrentCombat((combat) => {
      let newResistances = [...resistances]
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...combat.characters[index],
        resistances: newResistances
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onChangeType = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index]
      const charactersCopy = replaceItemAtIndex<Character>(combat.characters, index, {
        ...character,
        type: event.target.value
      })
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const duplicateCharacter = (index: number) => {
    setCurrentCombat((combat) => {
      const charactersCopy = [...combat.characters]
      const characterCopy = charactersCopy[index]

      const indexToInsert = index >= 0 ? index : charactersCopy.length
      charactersCopy.splice(indexToInsert + 1, 0, characterCopy)
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  if (currentCombat) {
    return (
      <>
        <div className={`${classes.root}`}>
          {!combatOngoing ? (
            <div className={`${classes.topActionsContainer}`}>
              <Button variant="contained" color="primary" onClick={onSort} className={`${classes.sortButton}`}>
                Sort by init
              </Button>
              <Button variant="contained" color="primary" onClick={() => clearCombat(CharacterType.NPC)} className={`${classes.sortButton}`}>
                Clear NPCs
              </Button>
              <Button variant="contained" color="primary" onClick={() => clearCombat(CharacterType.Enemy)} className={`${classes.sortButton}`}>
                Clear Enemies
              </Button>
              <Button variant="contained" color="primary" onClick={() => clearCombat()} className={`${classes.sortButton}`}>
                Clear All
              </Button>
            </div>
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
                const settingsAnchor = settingsAnchors[index]
                const settingsOpen = Boolean(settingsAnchor)

                const HPOf100 = (character.current_hit_points / character.hp_cap) * 100
                const totalHPOf100 = ((character.current_hit_points + character.temporary_hit_points) / character.hp_cap) * 100

                //console.log('character', character.name)
                //console.log(character)
                //console.log('HPOf100', HPOf100)
                //console.log('totalHPOf100', totalHPOf100)
                //console.log('\n\n')

                return (
                  <Draggable key={index} className={`${classes.draggableContainer}`}>
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
                        [classes.listItemPlayerBloodied]: character.type === CharacterType.Player && character.conditions.includes(Condition.Bloodied),
                        [classes.listItemNPC]: character.type === CharacterType.NPC,
                        [classes.listItemNPCBloodied]: character.type === CharacterType.NPC && character.conditions.includes(Condition.Bloodied)
                      })}
                    >
                      <Dialog open={regenDialogsOpen[index]} onClose={() => closeRegenDialog(index)} TransitionComponent={Transition}>
                        <DialogTitle id={`regen-dialog-title-${index}`}>{`Regen ${character.name} for ${character.regeneration} HP this turn?`}</DialogTitle>
                        <DialogContent>
                          <Typography variant="body2" paragraph={false}>
                            Conditions for {character.name}:
                          </Typography>
                          <ul>
                            {character.conditions.map((condition, index) => {
                              return <li key={index}>{condition}</li>
                            })}
                          </ul>
                        </DialogContent>
                        <DialogActions>
                          <Button variant="contained" onClick={() => closeRegenDialog(index)} autoFocus>
                            No
                          </Button>
                          <Button variant="contained" color="success" onClick={() => closeRegenDialog(index, true)}>
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
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
                        type="number"
                        id={`character-ac-${index}`}
                        tooltip={`AC ${calculateEffectTooltip('AC', character)}`}
                        className={`${classes.editableTextField}`}
                        textFieldClass={`${classes.editableTextField}`}
                        textClass={`${classes.ACText}`}
                        value={calculateEffect('AC', character)}
                        textWidth={25}
                        editWidth={3}
                        disabled={character.conditions.includes(Condition.Dead)}
                        onChange={onChangeCharacterAC(index)}
                      />
                      <TextField
                        id={`character-init-${index}`}
                        className={`${classes.textField} ${classes.initField}`}
                        value={character.init}
                        type="number"
                        label="init"
                        disabled={character.conditions.includes(Condition.Dead)}
                        onChange={onChangeCharacterInit(index)}
                        variant="outlined"
                        size="small"
                      />
                      <EditableText
                        id={`character-name-${index}`}
                        tooltip={character.name}
                        className={cx({
                          [classes.editableTextField]: true,
                          [classes.nameTextContainer]: true,
                          [classes.nameBloodied]: character.conditions.includes(Condition.Bloodied)
                        })}
                        textFieldClass={`${classes.editableTextField}`}
                        textClass={`${classes.nameText}`}
                        value={character.name}
                        textWidth={120}
                        editWidth={10}
                        disabled={character.conditions.includes(Condition.Dead)}
                        onChange={onChangeCharacterName(index)}
                        key={index}
                      />
                      <div className={`${classes.regeneration}`}>
                        {character.regeneration > 0 && (
                          <Tooltip title={`regeneration ${character.regeneration} per turn`} placement="top-end">
                            <span className="regenIcon"></span>
                          </Tooltip>
                        )}
                      </div>
                      <EditableText
                        id={`character-hp-${index}`}
                        type="number"
                        tooltip={`HP ${character.current_hit_points}${character.temporary_hit_points ? `+${character.temporary_hit_points}` : ''} / ${
                          character.hp_cap
                        }`}
                        className={cx({
                          [classes.editableTextField]: true,
                          [classes.HPText]: true
                        })}
                        textFieldClass={`${classes.editableTextField}`}
                        value={character.current_hit_points + (character.temporary_hit_points || 0)}
                        textWidth={30}
                        editWidth={4}
                        disabled={false}
                        onChange={onChangeCharacterHP(index)}
                      />
                      <Tooltip
                        title={`HP ${character.current_hit_points}${character.temporary_hit_points ? `+${character.temporary_hit_points}` : ''} / ${
                          character.hp_cap
                        }`}
                        placement="top-start"
                      >
                        <div className={classes.hpBarContainer}>
                          <BorderLinearProgress className={classes.hpBar} variant="buffer" value={HPOf100} valueBuffer={totalHPOf100} />
                        </div>
                      </Tooltip>
                      <Tooltip
                        title={
                          character.resistances &&
                          !_.isEmpty(character.resistances) && (
                            <>
                              Resistances:{' '}
                              {(character.resistances || []).map((resistance, resistanceIndex) => {
                                return (
                                  <React.Fragment key={resistanceIndex}>
                                    <Typography variant="body2">
                                      <span>{resistance}</span>
                                      <br />
                                    </Typography>
                                  </React.Fragment>
                                )
                              })}
                            </>
                          )
                        }
                        placement="right"
                      >
                        <TextField
                          id={`character-hit-points-${index}`}
                          type="number"
                          className={`${classes.textField} ${classes.hpField}`}
                          value={incomingDamages[index]}
                          onChange={onSetIncomingDamage(index)}
                          onKeyDown={onDamageOrHealCharacter(index)}
                          variant="outlined"
                          size="small"
                        />
                      </Tooltip>
                      <Typography
                        className={cx({
                          [classes.conditionList]: true,
                          [classes.player]: character.type === CharacterType.Player,
                          [classes.npc]: character.type === CharacterType.NPC,
                          [classes.enemy]: character.type === CharacterType.Enemy
                        })}
                      >
                        &nbsp;
                        {character.conditions.map((condition, conditionIndex) => {
                          return (
                            <React.Fragment key={conditionIndex}>
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
                        disableCloseOnSelect
                        value={_.without(character.conditions, Condition.Dead, Condition.Bloodied)}
                        className={`${classes.autocomplete}`}
                        options={_.without(Object.values(Condition), Condition.Dead, Condition.Bloodied) as Condition[]}
                        onChange={onChangeCondition(index)}
                        getOptionLabel={(option) => option.replaceAll('_', ' ')}
                        style={{ width: '10em' }}
                        PaperComponent={AutoCompleteItem}
                        renderInput={(params) => <TextField {...params} label="Conditions" variant="outlined" size="small" />}
                      />
                      {!combatOngoing && (
                        <IconButton style={{ color: 'rgba(0, 0, 0, 0.6)', marginRight: 0 }} onClick={() => duplicateCharacter(index)}>
                          <AddBox />
                        </IconButton>
                      )}
                      <IconButton style={{ color: 'rgba(0, 0, 0, 0.6)', marginRight: 0 }} onClick={(event: any) => openSettings(index, event)}>
                        <Settings />
                      </IconButton>
                      <Popover
                        id={settingsOpen ? `settings-${index}` : undefined}
                        open={settingsOpen}
                        anchorEl={settingsAnchor}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        onClose={(event, reason) => {
                          onChangeTemporaryHitPoints(index)(event, reason)
                          onChangeRegeneration(index)(event, reason)
                          closeSettings(index)
                        }}
                      >
                        <List className={`${classes.settingsList}`}>
                          <Typography variant="h5">{character.name}</Typography>
                          <ListItem className={`${classes.settingsListItem}`}>
                            <Typography>Type:</Typography>
                            <Select
                              size="small"
                              labelId={`type-${index}`}
                              id="type-select"
                              value={character.type}
                              label="Age"
                              onChange={onChangeType(index)}
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
                          </ListItem>
                          <ListItem className={`${classes.settingsListItem}`}>
                            <Typography>Resistance:</Typography>
                            <Autocomplete
                              id={`resistances-${index}`}
                              multiple
                              clearOnBlur
                              disableCloseOnSelect
                              value={character.resistances}
                              className={`${classes.autocomplete}`}
                              options={Object.values(DamageType)}
                              onChange={onChangeResistance(index)}
                              getOptionLabel={(option) => option.replaceAll('_', ' ')}
                              style={{ width: '10em' }}
                              PaperComponent={AutoCompleteItem}
                              renderInput={(params) => <TextField {...params} label="Resistances" variant="outlined" size="small" />}
                            />
                          </ListItem>
                          <ListItem className={`${classes.settingsListItem}`}>
                            <Typography>Temporary HP:</Typography>
                            <TextField
                              id={`temporary-hp-${index}`}
                              type="number"
                              value={incomingTempHPs[index] || character.temporary_hit_points}
                              onChange={onWriteTemporaryHitPoints(index)}
                              onKeyDown={onChangeTemporaryHitPoints(index)}
                              variant="outlined"
                              size="small"
                              sx={{
                                '&': {
                                  width: '10em'
                                }
                              }}
                            />
                          </ListItem>
                          <ListItem className={`${classes.settingsListItem}`}>
                            <Typography>Regeneration:</Typography>
                            <TextField
                              id={`regeneration-${index}`}
                              type="number"
                              value={incomingRegenerations[index] || character.regeneration}
                              onChange={onWriteRegeneration(index)}
                              onKeyDown={onChangeRegeneration(index)}
                              variant="outlined"
                              size="small"
                              sx={{
                                '&': {
                                  width: '10em'
                                }
                              }}
                            />
                          </ListItem>
                        </List>
                      </Popover>
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
              <AddCharacterInput onAdd={onAddCharacter(CharacterType.Player)}>Add Player</AddCharacterInput>
            </>
          )}
        </div>
        <div className={`${classes.actionsContainer}`}>
          {combatOngoing ? (
            <Button variant="contained" color="warning" onClick={() => setCombatOngoing(false)}>
              End combat
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                onSort()
                setCombatOngoing(true)
              }}
            >
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
        </div>
      </>
    )
  } else {
    return null
  }
}

export default CombatTracker
