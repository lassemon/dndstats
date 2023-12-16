import { withStyles } from 'tss-react/mui'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
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
import { combatTrackerState, customCharactersState } from 'recoil/atoms'
import _ from 'lodash'
import classNames from 'classnames/bind'

import Autocomplete from '@mui/material/Autocomplete'
import useStyles from './CombatTracker.styles'
import DeleteButton from 'components/DeleteButton'
import AddCharacterInput, { CharacterInput } from './AddCharacterInput'
import { CharacterType, Condition, DamageType, Source } from 'interfaces'
import EditableText from './EditableText'
import { ConditionToIconMap } from './Conditions'
import AddBox from '@mui/icons-material/AddBox'
import Settings from '@mui/icons-material/Settings'
import { TransitionProps } from '@mui/material/transitions'
import { DamageTypeToIconMap } from './DamageTypes'
import StatusModifiers from './StatusModifiers'
import CharacterCard from './CharacterCard'
import { getMonster, getMonsterList } from 'api/monsters'
import Character from 'domain/entities/Character'
import { replaceItemAtIndex } from 'utils/utils'
import { FifthESRDMonster } from 'domain/services/FifthESRDService'
import { MonsterListOption, emptyMonster } from 'domain/entities/Monster'
import { AutoCompleteItem } from 'components/AutocompleteItem/AutocompleteItem'

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
  const [{ characters: customCharacterList }] = useRecoilState(customCharactersState)
  const [monsterList, setMonsterList] = useState<MonsterListOption[]>([emptyMonster] as MonsterListOption[])
  const [loadingMonsterList, setLoadingMonsterList] = useState(false)
  const [selectedMonster, setSelectedMonster] = useState(emptyMonster)
  const [settingsAnchors, setSettingsAnchors] = React.useState<Array<HTMLButtonElement | null>>(currentCombat.characters.map(() => null))
  const [incomingDamages, setIncomingDamages] = React.useState<string[]>(currentCombat.characters.map(() => ''))
  const [incomingTempHPs, setIncomingTempHPs] = React.useState<string[]>(
    currentCombat.characters.map((character) => String(character.temporary_hit_points || '') || '')
  )
  const [incomingRegenerations, setIncomingRegenerations] = React.useState<string[]>(
    currentCombat.characters.map((character) => String(character.regeneration || '') || '')
  )
  const [regenDialogsOpen, setRegenDialogsOpen] = React.useState<boolean[]>(currentCombat.characters.map(() => false))

  // sync current combat with characters from custom character list
  // NOTE: DO NOT change custom character list state in this file, it will cause an infinite loop
  useEffect(() => {
    setCurrentCombat((combat) => {
      return {
        ...combat,
        characters: combat.characters.map((character) => {
          const existingCustomcharacter = customCharacterList.find((customCharacter) => customCharacter.id === character.id)
          return existingCustomcharacter ? existingCustomcharacter : character
        })
      }
    })
  }, [setCurrentCombat, customCharacterList])

  useEffect(() => {
    const fetchData = async () => {
      setLoadingMonsterList(true)
      const monsters = await getMonsterList()
      const customCharacterOptions: MonsterListOption[] = customCharacterList.map((customCharacter) => {
        return {
          id: customCharacter.id,
          name: customCharacter.name,
          url: undefined,
          source: customCharacter.source
        }
      })
      setMonsterList([emptyMonster, ...monsters, ...customCharacterOptions])
      setLoadingMonsterList(false)
    }

    fetchData().catch(console.error)
  }, [customCharacterList])

  useEffect(() => {
    const currentCharacter = currentCombat.characters[currentCombat.turn]
    const canRegenerate = currentCharacter.current_hit_points < currentCharacter.hit_points
    if (currentCharacter.regeneration > 0 && canRegenerate) {
      setRegenDialogsOpen((regenDialogs) => {
        return replaceItemAtIndex<boolean>(regenDialogs, currentCombat.turn, true)
      })
    }
  }, [currentCombat.turn, currentCombat.characters])

  useEffect(() => {
    setRegenDialogsOpen((regenDialogs) => {
      return regenDialogs.map(() => false)
    })
    setIncomingDamages((damages) => {
      return damages.map(() => '')
    })
  }, [currentCombat.characters])

  const closeRegenDialog = (index: number, regenCharacter?: boolean) => {
    if (regenCharacter === true) {
      onRegenerateCharacter(index)
    } else {
      setRegenDialogsOpen((regenDialogs) => {
        return replaceItemAtIndex<boolean>(regenDialogs, currentCombat.turn, false)
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

  const setCombatOngoing = (ongoing: boolean) => {
    setCurrentCombat((combat) => {
      return {
        ...combat,
        ongoing
      }
    })
  }

  const setCurrentTurn = (next: boolean) => {
    if (next) {
      if (currentCombat.turn === currentCombat.characters.length - 1) {
        setCurrentCombat((combat) => {
          return {
            ...combat,
            turn: 0,
            round: combat.round + 1
          }
        })
      } else {
        setCurrentCombat((combat) => {
          return {
            ...combat,
            turn: combat.turn + 1
          }
        })
      }
    } else {
      if (currentCombat.turn === 0) {
        setCurrentCombat((combat) => {
          return {
            ...combat,
            turn: currentCombat.characters.length - 1
          }
        })
        if (currentCombat.round > 1) {
          setCurrentCombat((combat) => {
            return {
              ...combat,
              round: combat.round - 1
            }
          })
        }
      } else {
        setCurrentCombat((combat) => {
          return {
            ...combat,
            turn: combat.turn - 1
          }
        })
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
      const charactersCopy = type ? [...combat.characters].filter((character) => character.player_type !== type) : []
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onChangeCharacterInit = (index: number) => (value: string) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      character.init = parseInt(value) || 0
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
      }
    })
  }

  const onChangeCharacterAC = (index: number) => (value: string) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      character.armor_classes = [{ type: 'natural', value: parseInt(value) || 0 }]
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
      }
    })
  }

  const onChangeCharacterName = (index: number) => (value: string) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      character.name = value
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
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
    setRegenDialogsOpen((regenDialogs) => {
      return [...regenDialogs, false]
    })
    setCurrentCombat((combat) => {
      const charactersCopy = [...combat.characters]

      const index = _.findIndex(charactersCopy, (_character) => {
        return _character.init < characterInput.init
      })
      const indexToInsert = index >= 0 ? index : charactersCopy.length
      charactersCopy.splice(
        indexToInsert,
        0,
        new Character({
          init: characterInput.init,
          armor_classes: [{ type: 'natural', value: characterInput.armorClass }],
          name: characterInput.name,
          hit_points: characterInput.hit_points,
          player_type: characterInput.player_type,
          source: Source.HomeBrew
        })
      )
      return {
        ...combat,
        characters: charactersCopy
      }
    })
  }

  const onAddMonster = async (event: React.SyntheticEvent, selected: MonsterListOption | null | string) => {
    if (selected && typeof selected !== 'string' && selected.url) {
      const monster: FifthESRDMonster = await getMonster(selected.url)
      if (monster) {
        setRegenDialogsOpen((regenDialogs) => {
          return [...regenDialogs, false]
        })

        setCurrentCombat((combat) => {
          const charactersCopy = [...combat.characters]

          const indexToInsert = charactersCopy.length
          charactersCopy.splice(
            indexToInsert,
            0,
            new Character({
              ...monster,
              init: 0,
              armor_classes: monster.armor_class,
              player_type: CharacterType.Enemy,
              source: Source.FifthESRD
            })
          )
          return {
            ...combat,
            characters: charactersCopy
          }
        })
      }
    } else if (selected && typeof selected !== 'string') {
      const customCharacter = customCharacterList.find((customCharacter) => customCharacter.id === selected.id)
      if (customCharacter) {
        setRegenDialogsOpen((regenDialogs) => {
          return [...regenDialogs, false]
        })
        setCurrentCombat((combat) => {
          const charactersCopy = [...combat.characters]

          const indexToInsert = charactersCopy.length
          charactersCopy.splice(indexToInsert, 0, customCharacter)
          return {
            ...combat,
            characters: charactersCopy
          }
        })
      }
    }
    setSelectedMonster(emptyMonster)
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
        newMaxHP !== combat.characters[index].hit_points ||
        newMaxHP !== combat.characters[index].hit_points_cap ||
        newMaxHP !== combat.characters[index].current_hit_points
      ) {
        const character = combat.characters[index].clone()
        character.hit_points = newMaxHP || 0
        return {
          ...combat,
          characters: replaceItemAtIndex<Character>(combat.characters, index, character)
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
    if (event.keyCode === 13 || (reason === 'backdropClick' && incomingTempHPs[index] !== '')) {
      setCurrentCombat((combat) => {
        const character = combat.characters[index].clone()
        character.temporary_hit_points = parseInt(incomingTempHPs[index]) || 0
        return {
          ...combat,
          characters: replaceItemAtIndex<Character>(combat.characters, index, character)
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
    if (event.keyCode === 13 || (reason === 'backdropClick' && incomingRegenerations[index] !== '')) {
      setCurrentCombat((combat) => {
        const character = combat.characters[index].clone()
        character.regeneration = parseInt(incomingRegenerations[index]) || 0
        return {
          ...combat,
          characters: replaceItemAtIndex<Character>(combat.characters, index, character)
        }
      })
    }
  }

  const onRegenerateCharacter = (index: number) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      const incomingRegeneration = character.regeneration || 0
      let newHp = character.current_hit_points + incomingRegeneration
      if (newHp > character.hit_points) {
        newHp = character.hit_points
      }

      character.damage = character.hit_points - newHp
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
      }
    })
  }

  const onSetIncomingDamage = (index: number) => (event: any) => {
    setIncomingDamages((damages) => {
      return replaceItemAtIndex<string>(damages, index, event.target.value || '')
    })
  }

  const onDamageOrHealCharacter = (index: number) => (event: any) => {
    if (event.keyCode === 13 || event.type === 'blur') {
      setCurrentCombat((combat) => {
        const character = combat.characters[index].clone()

        const incomingHpChange = parseInt(incomingDamages[index]) || 0
        const changingHp = incomingHpChange !== 0
        const tryingToHeal = incomingHpChange > 0

        if (changingHp) {
          tryingToHeal ? character.heal(incomingHpChange) : character.takeDamage(incomingHpChange)
          // setting temp hp input field value to be same as characters after taking damage
          setIncomingTempHPs((tempHPs) => {
            return replaceItemAtIndex<string>(tempHPs, index, String(character.temporary_hit_points || ''))
          })
        }

        return {
          ...combat,
          characters: replaceItemAtIndex<Character>(combat.characters, index, character)
        }
      })
    }
  }

  const onRemoveCondition = (index: number, condition: Condition) => (event: any) => {
    // Mouse middle button
    if (event.button === 1) {
      setCurrentCombat((combat) => {
        const character = combat.characters[index].clone()
        character.removeCondition(condition)
        return {
          ...combat,
          characters: replaceItemAtIndex<Character>(combat.characters, index, character)
        }
      })
    }
  }

  const onChangeCondition = (index: number) => (event: any, conditions: Condition[]) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      character.conditions = conditions
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
      }
    })
  }

  const onChangeResistance = (index: number) => (event: any, resistances: DamageType[]) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      character.damage_resistances = [...resistances]
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
      }
    })
  }

  const onChangeVulnerability = (index: number) => (event: any, vulnerabilities: DamageType[]) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      character.damage_vulnerabilities = [...vulnerabilities]
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
      }
    })
  }

  const onChangeImmunity = (index: number) => (event: any, immunities: DamageType[]) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      character.damage_immunities = [...immunities]
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
      }
    })
  }

  const onChangeType = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const character = combat.characters[index].clone()
      character.player_type = event.target.value
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
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

  const onChangeCharacterCard = (index: number) => (key: string, character: Character) => {
    setCurrentCombat((combat) => {
      return {
        ...combat,
        characters: replaceItemAtIndex<Character>(combat.characters, index, character)
      }
    })
  }

  if (currentCombat) {
    return (
      <>
        <div className={`${classes.root}`}>
          {!currentCombat.ongoing ? (
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
                {currentCombat.round}
              </Typography>
              <br />
              <Typography variant="caption" sx={{ fontSize: '0.8em' }}>
                Time elapsed {currentCombat.round * 6 - 6} seconds
              </Typography>
            </Typography>
          )}
          <List>
            <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
              {currentCombat.characters.map((character, index) => {
                const settingsAnchor = settingsAnchors[index]
                const settingsOpen = Boolean(settingsAnchor)

                const HPOf100 = (character.current_hit_points / character.hit_points_cap) * 100
                const totalHPOf100 = ((character.current_hit_points + character.temporary_hit_points) / character.hit_points_cap) * 100

                /*console.log('character', character.name)
                console.log(character)
                console.log('HPOf100', HPOf100)
                console.log('totalHPOf100', totalHPOf100)
                console.log('\n\n')*/

                //console.log(character)

                return (
                  <Draggable key={index} className={`${classes.draggableContainer}`}>
                    <ListItem
                      dense
                      disableGutters
                      disabled={character.isUnconscious()}
                      className={cx({
                        [classes.listItem]: true,
                        [classes.listItemCurrent]: currentCombat.turn === index && currentCombat.ongoing,
                        [classes.listItemBloodied]: character.isBloodied(),
                        [classes.listItemUnconscious]: character.isUnconscious(),
                        [classes.listItemPlayer]: character.player_type === CharacterType.Player,
                        [classes.listItemPlayerBloodied]: character.player_type === CharacterType.Player && character.isBloodied(),
                        [classes.listItemNPC]: character.player_type === CharacterType.NPC,
                        [classes.listItemNPCBloodied]: character.player_type === CharacterType.NPC && character.isBloodied()
                      })}
                    >
                      <div className={`${classes.regeneration}`}>
                        {character.regeneration > 0 && (
                          <Tooltip title={`regeneration ${character.regeneration} per turn`} placement="top-end">
                            <span className="regenIcon"></span>
                          </Tooltip>
                        )}
                      </div>
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
                      {currentCombat.ongoing && (
                        <ListItemIcon className={`${character.isUnconscious() ? '' : 'drag-handle'} ${classes.dragIconContainer}`}>
                          {currentCombat.turn === index ? <CurrentTurnIcon fontSize="large" /> : <span style={{ width: '1.5em' }}>&nbsp;</span>}
                        </ListItemIcon>
                      )}
                      {!currentCombat.ongoing && (
                        <>
                          <ListItemIcon className={`${character.isUnconscious() ? '' : 'drag-handle'} ${classes.dragIconContainer}`}>
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
                        tooltip={`AC ${character.armor_class_label}`}
                        className={`${classes.editableTextField}`}
                        textFieldClass={`${classes.editableTextField}`}
                        textClass={`${classes.ACText}`}
                        value={character.armor_class}
                        textWidth={25}
                        editWidth={3}
                        disabled={character.isUnconscious()}
                        onChange={onChangeCharacterAC(index)}
                      />
                      <EditableText
                        id={`character-init-${index}`}
                        className={cx({
                          [classes.editableTextField]: true,
                          [classes.initField]: true,
                          [classes.initText]: true
                        })}
                        textFieldClass={`${classes.editableTextField}`}
                        editWidth={3}
                        value={character.init}
                        type="number"
                        disabled={character.isUnconscious()}
                        onChange={onChangeCharacterInit(index)}
                      />
                      <EditableText
                        id={`character-name-${index}`}
                        tooltip={<CharacterCard character={character} resizeable={false} onChange={onChangeCharacterCard(index)} />}
                        tooltipPlacement="bottom-start"
                        tooltipClass={`${classes.nameTextTooltip}`}
                        className={cx({
                          [classes.editableTextField]: true,
                          [classes.nameTextContainer]: true,
                          [classes.nameBloodied]: character.isBloodied()
                        })}
                        textFieldClass={`${classes.editableTextField}`}
                        textClass={`${classes.nameText}`}
                        value={character.name}
                        textWidth={120}
                        editWidth={10}
                        disabled={character.isUnconscious()}
                        onChange={onChangeCharacterName(index)}
                        key={index}
                      />
                      <Tooltip
                        title={
                          <StatusModifiers
                            resistances={character.damage_resistances}
                            vulnerabilities={character.damage_vulnerabilities}
                            immunities={character.damage_immunities}
                          />
                        }
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: { maxWidth: 'none' }
                          }
                        }}
                      >
                        <div className={`${classes.damageModifiers}`}>
                          {(character.damage_immunities || []).map((immunity, immunityIndex) => {
                            return (
                              <span className={`${classes.immunity}`} key={immunityIndex}>
                                {DamageTypeToIconMap[immunity] || null}
                              </span>
                            )
                          })}
                          {(character.damage_resistances || []).map((resistance, resistanceIndex) => {
                            return (
                              <span className={`${classes.resistance}`} key={resistanceIndex}>
                                {DamageTypeToIconMap[resistance] || null}
                              </span>
                            )
                          })}
                          {(character.damage_vulnerabilities || []).map((vulnerability, vulnerabilityIndex) => {
                            return <span key={vulnerabilityIndex}>{DamageTypeToIconMap[vulnerability] || null}</span>
                          })}
                        </div>
                      </Tooltip>
                      <EditableText
                        id={`character-hp-${index}`}
                        type="number"
                        tooltip={`HP ${character.current_hit_points}${character.temporary_hit_points ? `+${character.temporary_hit_points}` : ''} / ${
                          character.hit_points_cap
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
                          character.hit_points_cap
                        }`}
                        placement="top-start"
                      >
                        <div className={classes.hpBarContainer}>
                          <BorderLinearProgress className={classes.hpBar} variant="buffer" value={HPOf100} valueBuffer={totalHPOf100} />
                        </div>
                      </Tooltip>
                      <Tooltip
                        title={
                          (!_.isEmpty(character.damage_resistances) ||
                            !_.isEmpty(character.damage_vulnerabilities) ||
                            !_.isEmpty(character.damage_immunities)) && (
                            <StatusModifiers
                              resistances={character.damage_resistances}
                              vulnerabilities={character.damage_vulnerabilities}
                              immunities={character.damage_immunities}
                            />
                          )
                        }
                        placement="right"
                        componentsProps={{
                          tooltip: {
                            sx: { maxWidth: 'none' }
                          }
                        }}
                      >
                        <TextField
                          id={`character-hit-points-${index}`}
                          type="tel"
                          className={`${classes.textField} ${classes.hpField}`}
                          value={incomingDamages[index]}
                          onChange={onSetIncomingDamage(index)}
                          onKeyDown={onDamageOrHealCharacter(index)}
                          onBlur={onDamageOrHealCharacter(index)}
                          variant="outlined"
                          size="small"
                        />
                      </Tooltip>
                      <Typography
                        className={cx({
                          [classes.conditionList]: true,
                          [classes.player]: character.player_type === CharacterType.Player,
                          [classes.npc]: character.player_type === CharacterType.NPC,
                          [classes.enemy]: character.player_type === CharacterType.Enemy
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
                        limitTags={0}
                        disabled={character.isUnconscious()}
                        disableCloseOnSelect
                        value={_.without(character.conditions, Condition.Dead, Condition.Unconscious, Condition.Bloodied)}
                        className={`${classes.autocomplete}`}
                        options={_.without(Object.values(Condition), Condition.Dead, Condition.Unconscious, Condition.Bloodied) as Condition[]}
                        onChange={onChangeCondition(index)}
                        getOptionLabel={(option) => option.replaceAll('_', ' ')}
                        style={{ width: '14em' }}
                        PaperComponent={AutoCompleteItem}
                        renderInput={(params) => <TextField {...params} label="Conditions" variant="outlined" size="small" />}
                      />
                      {!currentCombat.ongoing && (
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
                              value={character.player_type}
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
                            <Typography>Resistances:</Typography>
                            <Autocomplete
                              id={`resistances-${index}`}
                              multiple
                              clearOnBlur
                              disableCloseOnSelect
                              value={character.damage_resistances}
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
                            <Typography>Vulnerabilities:</Typography>
                            <Autocomplete
                              id={`vulnerabilitiers-${index}`}
                              multiple
                              clearOnBlur
                              disableCloseOnSelect
                              value={character.damage_vulnerabilities}
                              className={`${classes.autocomplete}`}
                              options={Object.values(DamageType)}
                              onChange={onChangeVulnerability(index)}
                              getOptionLabel={(option) => option.replaceAll('_', ' ')}
                              style={{ width: '10em' }}
                              PaperComponent={AutoCompleteItem}
                              renderInput={(params) => <TextField {...params} label="Vulnerabilities" variant="outlined" size="small" />}
                            />
                          </ListItem>
                          <ListItem className={`${classes.settingsListItem}`}>
                            <Typography>Immunities:</Typography>
                            <Autocomplete
                              id={`immunities-${index}`}
                              multiple
                              clearOnBlur
                              disableCloseOnSelect
                              value={character.damage_immunities}
                              className={`${classes.autocomplete}`}
                              options={Object.values(DamageType)}
                              onChange={onChangeImmunity(index)}
                              getOptionLabel={(option) => option.replaceAll('_', ' ')}
                              style={{ width: '10em' }}
                              PaperComponent={AutoCompleteItem}
                              renderInput={(params) => <TextField {...params} label="Immunities" variant="outlined" size="small" />}
                            />
                          </ListItem>
                          <ListItem className={`${classes.settingsListItem}`}>
                            <Typography>Temporary HP:</Typography>
                            <TextField
                              id={`temporary-hp-${index}`}
                              type="text"
                              value={incomingTempHPs[index]}
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
                              value={incomingRegenerations[index]}
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
          {!currentCombat.ongoing && (
            <>
              <AddCharacterInput onAdd={onAddCharacter} text={'Add Player'}>
                <Autocomplete
                  id={`add-monster-dropdown`}
                  blurOnSelect
                  clearOnBlur
                  disableClearable
                  filterSelectedOptions
                  groupBy={(option) => option.source}
                  className={`${classes.autocomplete}`}
                  value={selectedMonster}
                  loading={loadingMonsterList}
                  options={monsterList.sort((a, b) => b.source.localeCompare(a.source))}
                  onChange={onAddMonster}
                  getOptionLabel={(option) => (typeof option !== 'string' ? option?.name : '')}
                  style={{ width: '14em' }}
                  PaperComponent={AutoCompleteItem}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Monster"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingMonsterList ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                    />
                  )}
                  sx={{
                    '&&': {
                      margin: '0 0 0 2em'
                    }
                  }}
                />
              </AddCharacterInput>
            </>
          )}
        </div>
        <div className={`${classes.actionsContainer}`}>
          {currentCombat.ongoing ? (
            <Button variant="contained" color="warning" onClick={() => setCombatOngoing(false)}>
              Stop combat
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
          {currentCombat.ongoing && (
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
          {currentCombat.ongoing && (
            <Button
              variant="contained"
              onClick={() => {
                setCurrentCombat((combat) => {
                  return {
                    ...combat,
                    turn: 0,
                    round: 1
                  }
                })
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
