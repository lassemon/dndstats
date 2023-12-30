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
import { PlayerType, Source } from 'interfaces'
import CharacterCard from 'components/Character/CharacterCard'
import { upsertToArray } from 'utils/utils'
import DeleteButton from 'components/DeleteButton'
import ScreenshotButton from 'components/ScreenshotButton'
import _ from 'lodash'
import { useOrientation } from 'utils/hooks'
import EditButton from 'components/EditButton'

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <p className={classes.blockDescription}>{children}</p>
}

export const MonsterStats: React.FC = () => {
  const { classes } = useStyles()
  const [currentMonster, setCurrentMonster] = useRecoilState(monsterState)
  const [{ characters: customCharacterList }, setCustomCharacters] = useRecoilState(customCharactersState)
  const [combatTracker] = useRecoilState(combatTrackerState)

  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

  const [monsterList, setMonsterList] = useState<MonsterListOption[]>([emptyMonster] as MonsterListOption[])
  const [selectedMonster, setSelectedMonster] = useState(emptyMonster)
  const [monsterActionsVisible, setMonsterActionsVisible] = useState(true)
  const [loadingMonsterList, setLoadingMonsterList] = useState(false)
  const [editMode, setEditMode] = useState(false)

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

    fetchData().catch((error) => {
      setLoadingMonsterList(false)
      console.error(error)
    })
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
            player_type: PlayerType.Enemy,
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

  const onToggletEditMode = () => {
    setEditMode((editMode) => !editMode)
  }

  return (
    <>
      <div className={isPortrait ? classes.rootPortrait : classes.rootLandscape}>
        <CharacterCard
          character={currentMonster}
          className={isPortrait ? classes.characterCardContainerPortrait : classes.characterCardContainerLandscape}
          onChange={onChangeMonster}
          editMode={editMode}
        />
        <div className={classes.rightContainer}>
          {currentMonster.imageElement && (
            <div className={`${classes.imageContainer}`}>
              <img alt={currentMonster.imageElement?.props.alt} src={`${currentMonster.imageElement?.props.src}`} />
            </div>
          )}
          {currentMonster.description && (
            <div className={classes.mainDescription}>
              {currentMonster.description.split('\n').map((value, key) => {
                return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
              })}
            </div>
          )}
          <div className={`${classes.monsterActionsContainer} ${monsterActionsVisible ? '' : classes.hidden}`}>
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
      <div style={{ display: 'inline-block' }}>
        <EditButton onClick={onToggletEditMode} color={monsterActionsVisible ? 'default' : 'info'} />
      </div>
    </>
  )
}

export default MonsterStats
