import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { combatTrackerState, customCharactersState, monsterState } from 'recoil/atoms'

import useStyles from './MonsterStats.styles'
import { Autocomplete, Button, ButtonGroup, CircularProgress, TextField, Tooltip } from '@mui/material'
import { MonsterListOption, emptyMonster } from 'domain/entities/Monster'
import { getMonster, getMonsterList } from 'api/monsters'
import { FifthESRDMonster } from 'domain/services/FifthESRDService'
import { AutoCompleteItem } from 'components/AutocompleteItem/AutocompleteItem'
import Character from 'domain/entities/Character'
import { CharacterType, Source } from 'interfaces'
import CharacterCard from 'components/CombatTracker/CharacterCard'
import { upsertToArray } from 'utils/utils'
import DeleteButton from 'components/DeleteButton'
import ScreenshotButton from 'components/ScreenshotButton'
import _ from 'lodash'

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <p className={classes.blockDescription}>{children}</p>
}

/*const DescriptionInline: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <p className={classes.inlineDescription}>{children}</p>
}*/

export const MonsterStats: React.FC = () => {
  const { classes } = useStyles()
  const [currentMonster, setCurrentMonster] = useRecoilState(monsterState)
  const [{ characters: customCharacterList }, setCustomCharacters] = useRecoilState(customCharactersState)
  const [combatTracker] = useRecoilState(combatTrackerState)

  const [monsterList, setMonsterList] = useState<MonsterListOption[]>([emptyMonster] as MonsterListOption[])
  const [selectedMonster, setSelectedMonster] = useState(emptyMonster)
  const [monsterActionsVisible, setMonsterActionsVisible] = useState(true)
  const [loadingMonsterList, setLoadingMonsterList] = useState(false)

  // sync characters in custom character list from combat tracker
  // NOTE: DO NOT change combat tracker state in this file, it will cause an infinite loop
  useEffect(() => {
    const customCharactersExistingInCombatTracker = combatTracker.characters.filter((combatTrackerCharacter) => {
      return customCharacterList.find((customCharacter) => customCharacter.id === combatTrackerCharacter.id)
    })
    if (!_.isEmpty(customCharactersExistingInCombatTracker)) {
      setCustomCharacters((customCharacters) => {
        return {
          ...customCharacters,
          characters: _.unionBy(customCharactersExistingInCombatTracker, customCharacters.characters, (character) => character.id)
        }
      })
    }
    const currentMonsterExistsingCombatTracker = combatTracker.characters.find((combatTrackerCharacter) => {
      return combatTrackerCharacter.id === currentMonster.id
    })
    if (!!currentMonsterExistsingCombatTracker) {
      setCurrentMonster(currentMonsterExistsingCombatTracker)
    }
  }, [])

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

  const onChangeMonster = (key: string, character: Character) => {
    setCurrentMonster((currentMonster) => {
      return currentMonster.clone(character.toJSON())
    })
  }

  const onSaveCustomCharacter = () => {
    let characterToBeSaved = currentMonster.clone({ source: Source.HomeBrew })
    const existingCharacter = monsterList.concat(customCharacterList).find((monster) => monster.id === currentMonster.id)
    const characterExists = !!existingCharacter
    const tryingToOverwriteNonHomebrewCharacter = characterExists && existingCharacter?.source !== Source.HomeBrew

    if (tryingToOverwriteNonHomebrewCharacter) {
      setCurrentMonster((currentMonster) => {
        const monsterWithNameCount = (customCharacterList || []).filter((customCharacter) => customCharacter.id.includes(currentMonster.id)).length
        const newName = `${currentMonster.name} #${monsterWithNameCount + 1}`
        characterToBeSaved = characterToBeSaved.clone({ name: newName })
        return characterToBeSaved
      })
    }
    setCustomCharacters((customCharacters) => {
      return {
        ...customCharacters,
        characters: upsertToArray(customCharacterList, characterToBeSaved, 'id')
      }
    })
  }

  const onSelectMonster = async (event: React.SyntheticEvent, selected: MonsterListOption | null | string) => {
    if (selected && typeof selected !== 'string' && selected.url) {
      const monster: FifthESRDMonster = await getMonster(selected.url)
      if (monster) {
        setCurrentMonster(
          new Character({
            ...monster,
            init: 0,
            armor_classes: monster.armor_class,
            player_type: CharacterType.Enemy,
            source: Source.FifthESRD
          })
        )
      }
    } else if (selected && typeof selected !== 'string') {
      const monster = customCharacterList.find((customCharacter) => customCharacter.id === selected.id)
      if (monster) {
        setCurrentMonster(monster)
      }
    }
    setSelectedMonster(emptyMonster)
  }

  const onSelectCustomCharacter = (index: number) => (event: React.MouseEvent) => {
    if (customCharacterList[index]) {
      setCurrentMonster(customCharacterList[index])
    }
  }

  const onDeleteCustomCharacter = (index: number) => () => {
    setCustomCharacters((customCharacters) => {
      const charactersCopy = [...customCharacters.characters]
      charactersCopy.splice(index, 1)
      return {
        ...customCharacters,
        characters: charactersCopy
      }
    })
  }

  const onToggletMonsterActionsVisible = () => {
    setMonsterActionsVisible((monsterActionsVisible) => !monsterActionsVisible)
  }

  return (
    <>
      {' '}
      {/*
      <div>
        <StatsContainer className={classes.monsterContainer}>
          <h1 className={classes.name}>{currentMonster.name}</h1>
          <h2 className={classes.shortDescription}>{currentMonster.short_description}</h2>
          <TaperedRule />
          <div className={classes.baseStatsContainer}>
            <div>
              <span className={classes.statHeader}>Armor Class</span>
              <span className={classes.statValue}>{currentMonster.armor_class_label}</span>
            </div>
            <div>
              <span className={classes.statHeader}>Hit Points</span>
              <span className={classes.statValue}>{currentMonster.hit_points}</span>
            </div>
            <div>
              <span className={classes.statHeader}>Speed</span>
              <span className={classes.statValue}>{currentMonster.speed_label}</span>
            </div>
          </div>
          <TaperedRule />
          <div>
            <div className={classes.stats}>
              <div className={classes.statHeader}>STR</div>
              <div className={classes.statHeader}>DEX</div>
              <div className={classes.statHeader}>CON</div>
              <div className={classes.statHeader}>INT</div>
              <div className={classes.statHeader}>WIS</div>
              <div className={classes.statHeader}>CHA</div>
              <div className={classes.rowBreak} />
              <div className={classes.statValue}>
                <span>{currentMonster.strenght_label}</span>
              </div>
              <div className={classes.statValue}>
                <span>{currentMonster.dexterity_label}</span>
              </div>
              <div className={classes.statValue}>
                <span>{currentMonster.constitution_label}</span>
              </div>
              <div className={classes.statValue}>
                <span>{currentMonster.intelligence_label}</span>
              </div>
              <div className={classes.statValue}>
                <span>{currentMonster.wisdom_label}</span>
              </div>
              <div className={classes.statValue}>
                <span>{currentMonster.charisma_label}</span>
              </div>
            </div>
            <TaperedRule />
            <div className={classes.baseStatsContainer}>
              {currentMonster.skills && (
                <div>
                  <span className={classes.statHeader}>Skills</span>
                  <span className={classes.statValue}>{currentMonster.skills_label}</span>
                </div>
              )}
              {!_.isEmpty(currentMonster.saving_throws) && (
                <div>
                  <span className={classes.statHeader}>Saving Throws</span>
                  <span className={classes.statValue}>{currentMonster.saving_throws_label}</span>
                </div>
              )}
              {!_.isEmpty(currentMonster.damage_resistances) && (
                <div>
                  <span className={classes.statHeader}>Damage Resistances</span>
                  <span className={classes.statValue}>{currentMonster.damage_resistances_label}</span>
                </div>
              )}
              {!_.isEmpty(currentMonster.damage_immunities) && (
                <div>
                  <span className={classes.statHeader}>Damage Immunities</span>
                  <span className={classes.statValue}>{currentMonster.damage_immunities_label}</span>
                </div>
              )}
              {!_.isEmpty(currentMonster.condition_immunities) && (
                <div>
                  <span className={classes.statHeader}>Condition Immunities</span>
                  <span className={classes.statValue}>{currentMonster.condition_immunities_label}</span>
                </div>
              )}
              {currentMonster.senses && (
                <div>
                  <span className={classes.statHeader}>Senses</span>
                  <span className={classes.statValue}>{currentMonster.senses_label}</span>
                </div>
              )}
              {currentMonster.languages && (
                <div>
                  <span className={classes.statHeader}>Languages</span>
                  <span className={classes.statValue}>{currentMonster.languages}</span>
                </div>
              )}
              {currentMonster.challenge_rating && (
                <div>
                  <span className={classes.statHeader}>Challenge</span>
                  <span className={classes.statValue}>{currentMonster.challenge_rating_label}</span>
                </div>
              )}
            </div>
            <TaperedRule />
            <div>
              {currentMonster.special_abilities.map((special_ability, key) => {
                return (
                  <div className={classes.actionRow} key={key}>
                    <h3 key={`header-${key}`} className={classes.actionName}>
                      {special_ability.name}
                    </h3>
                    <DescriptionInline>{special_ability.desc}</DescriptionInline>
                  </div>
                )
              })}
            </div>
            <div>
              <h3 className={classes.featureName}>ACTIONS</h3>
              {currentMonster.actions.map((action, key) => {
                return (
                  <div className={classes.actionRow} key={key}>
                    <h3 key={`header-${key}`} className={classes.actionName}>
                      {action.name}
                    </h3>
                    <DescriptionInline>{action.desc}</DescriptionInline>
                  </div>
                )
              })}
            </div>
            {currentMonster.reactions.length > 0 && (
              <div>
                <h3 className={classes.featureName}>REACTIONS</h3>
                {currentMonster.reactions.map((reaction, key) => {
                  return (
                    <div className={classes.actionRow} key={key}>
                      <h3 key={`header-${key}`} className={classes.actionName}>
                        {reaction.name}
                      </h3>
                      <DescriptionInline>{reaction.desc}</DescriptionInline>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </StatsContainer>
      </div>
              */}
      <div className={classes.root}>
        <CharacterCard character={currentMonster} className={classes.characterCardContainer} onChange={onChangeMonster} />
        <div className={classes.rightContainer}>
          {currentMonster.imageElement && (
            <div className={`${classes.imageContainer}`}>
              <img alt={currentMonster.imageElement?.props.alt} src={`${currentMonster.imageElement?.props.src}`} />
            </div>
          )}
          <div className={`${classes.monsterActionsContainer} ${monsterActionsVisible ? '' : classes.hidden}`}>
            {currentMonster.description && (
              <div className={classes.mainDescription}>
                {currentMonster.description.split('\n').map((value, key) => {
                  return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
                })}
              </div>
            )}
            <Autocomplete
              id={`add-monster-dropdown`}
              blurOnSelect
              clearOnBlur
              fullWidth
              disableClearable
              filterSelectedOptions
              groupBy={(option) => option.source}
              className={`${classes.autocomplete}`}
              value={selectedMonster}
              loading={loadingMonsterList}
              options={monsterList.sort((a, b) => b.source.localeCompare(a.source))}
              onChange={onSelectMonster}
              getOptionLabel={(option) => (typeof option !== 'string' ? option?.name : '')}
              PaperComponent={AutoCompleteItem}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Monster"
                  variant="filled"
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
                  margin: '1.5em 0 0 0'
                }
              }}
            />
            <ButtonGroup
              orientation="vertical"
              size="small"
              variant="text"
              color="secondary"
              sx={{
                overflowY: 'auto',
                maxHeight: '20em',
                margin: '1em 0'
              }}
            >
              {customCharacterList.map((customCharacter, index) => {
                return (
                  <ButtonGroup key={index} size="small" variant="text" color="secondary">
                    <Button
                      onClick={onSelectCustomCharacter(index)}
                      fullWidth
                      sx={{
                        '&&': {
                          borderRight: 0
                        }
                      }}
                    >
                      {customCharacter.name}
                    </Button>
                    <DeleteButton size="small" onClick={onDeleteCustomCharacter(index)} />
                  </ButtonGroup>
                )
              })}
            </ButtonGroup>
            <Button variant="contained" onClick={onSaveCustomCharacter}>
              Save current character
            </Button>
          </div>
        </div>
      </div>
      <Tooltip title="Toggle screenshot mode" placement="top-start">
        <div style={{ display: 'inline-block' }}>
          <ScreenshotButton onClick={onToggletMonsterActionsVisible} color={monsterActionsVisible ? 'default' : 'info'} />
        </div>
      </Tooltip>
    </>
  )
}

export default MonsterStats
