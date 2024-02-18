import React, { HTMLAttributes, useEffect, useMemo, useState } from 'react'
import { CombatAtom, combatTrackerAtom, customCharactersAtom, monsterAtom } from 'infrastructure/dataAccess/atoms'

import useStyles from './MonsterStats.styles'
import { Autocomplete, Box, Button, ButtonGroup, CircularProgress, TextField, Tooltip } from '@mui/material'
import { MonsterListOption, emptyMonster } from 'domain/entities/Monster'
import { getMonster, getMonsterList } from 'api/monsters'
import { FifthESRDMonster } from 'domain/services/FifthESRDService'
import { AutoCompleteItem } from 'components/AutocompleteItem/AutocompleteItem'
import Character from 'domain/entities/Character'
import { PlayerType } from 'interfaces'
import CharacterCard from 'components/Character/CharacterCard'
import { upsertToArray } from 'utils/utils'
import DeleteButton from 'components/DeleteButton'
import ScreenshotButton from 'components/ScreenshotButton'
import _ from 'lodash'
import { useOrientation } from 'utils/hooks'
import EditButton from 'components/EditButton'
import { useAtom } from 'jotai'
import LoadingIndicator from 'components/LoadingIndicator'
import classNames from 'classnames'
import Showdown from 'showdown'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from 'components/ErrorFallback'
import { Source } from '@dmtool/domain'

const DescriptionBlock: React.FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  const { children } = props
  const { classes } = useStyles()
  if (props.dangerouslySetInnerHTML && typeof props.dangerouslySetInnerHTML.__html === 'string') {
    const converter = new Showdown.Converter()
    const htmlConvertedText = converter.makeHtml(props.dangerouslySetInnerHTML.__html)
    return <p className={classes.blockDescription} dangerouslySetInnerHTML={{ __html: htmlConvertedText }} />
  }
  return <p className={classes.blockDescription}>{children}</p>
}

export const MonsterStats: React.FC = () => {
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const [currentMonster, setCurrentMonster] = useAtom(useMemo(() => monsterAtom, []))

  const [customCharacters, setCustomCharacters] = useAtom(useMemo(() => customCharactersAtom, []))
  const customCharacterList = customCharacters?.characters || []
  const [combatTracker] = useAtom(useMemo(() => combatTrackerAtom, []))

  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

  const [monsterList, setMonsterList] = useState<MonsterListOption[]>([emptyMonster] as MonsterListOption[])
  const [selectedMonster, setSelectedMonster] = useState(emptyMonster)
  const [monsterActionsVisible, setMonsterActionsVisible] = useState(true)
  const [loadingMonsterList, setLoadingMonsterList] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const existingCustomCharacter = customCharacterList.find((customCharacter) => customCharacter.id === currentMonster?.id)
  const monsterSavedInHomebrew = currentMonster?.isEqual(existingCustomCharacter)

  const syncCombatTrackerWithCustomCharacterList = (_combatTracker: CombatAtom) => {
    const customCharactersExistingInCombatTracker = _combatTracker.characters.filter((combatTrackerCharacter) => {
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
    const currentMonsterInCombatTracker = _combatTracker.characters.find((combatTrackerCharacter) => {
      return combatTrackerCharacter.id === currentMonster?.id
    })
    if (!!currentMonsterInCombatTracker) {
      setCurrentMonster(currentMonsterInCombatTracker)
    }
  }

  const fetchMonsterList = () => {
    const fetchData = async () => {
      if (!loadingMonsterList) {
        setLoadingMonsterList(true)
        const monsters = await getMonsterList()
        const newMonsterList = [...monsterList, ...monsters]
        setMonsterList(newMonsterList)
        setLoadingMonsterList(false)
      }
    }

    fetchData().catch((error) => {
      setLoadingMonsterList(false)
      console.error(error)
    })
  }

  // sync characters in custom character list from combat tracker
  // NOTE: DO NOT change combat tracker state in this file, it will cause an infinite loop
  useEffect(() => {
    if (combatTracker) {
      syncCombatTrackerWithCustomCharacterList(combatTracker)
    }

    fetchMonsterList()
  }, [])

  useEffect(() => {
    const customCharacterOptions: MonsterListOption[] = [...customCharacterList].map((customCharacter) => {
      return {
        id: customCharacter.id,
        name: customCharacter.name,
        url: undefined,
        source: customCharacter.source
      }
    })
    setMonsterList([...monsterList, ...customCharacterOptions])
  }, [customCharacterList])

  const onChangeMonster = (key: string, character: Character) => {
    setCurrentMonster((currentMonster: any) => {
      return currentMonster?.clone(character.toJSON())
    })
  }

  const onSaveCustomCharacter = () => {
    if (currentMonster) {
      let characterToBeSaved = currentMonster.clone({ source: Source.HomeBrew })
      const existingCharacter = monsterList.concat(customCharacterList).find((monster) => monster.id === currentMonster.id)
      const characterExists = !!existingCharacter
      const tryingToOverwriteNonHomebrewCharacter = characterExists && existingCharacter?.source !== Source.HomeBrew

      if (tryingToOverwriteNonHomebrewCharacter) {
        setCurrentMonster((currentMonster) => {
          if (currentMonster) {
            const monsterWithNameCount = (customCharacterList || []).filter((customCharacter) => customCharacter.id.includes(currentMonster.id)).length
            const newName = `${currentMonster.name} #${monsterWithNameCount + 1}`
            characterToBeSaved = characterToBeSaved?.clone({ name: newName })
            return characterToBeSaved
          }
        })
      }
      setCustomCharacters((customCharacters) => {
        return {
          ...customCharacters,
          characters: upsertToArray(customCharacterList, characterToBeSaved, 'id')
        }
      })
    }
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

  const onCloseEditMode = () => {
    setEditMode(false)
  }

  if (!currentMonster) {
    return <LoadingIndicator />
  }

  return (
    <>
      <div
        className={cx({
          [classes.root]: true,
          [classes.rootPortrait]: isPortrait,
          [classes.rootLandscape]: !isPortrait
        })}
      >
        <ErrorBoundary FallbackComponent={(props) => <ErrorFallback {...props} className={classes.errorFallback} />}>
          <div
            className={cx({
              [classes.unsaved]: !monsterSavedInHomebrew && existingCustomCharacter
            })}
          >
            <CharacterCard
              character={currentMonster}
              className={isPortrait ? classes.characterCardContainerPortrait : classes.characterCardContainerLandscape}
              onChange={onChangeMonster}
              onCloseEditMode={onCloseEditMode}
              editMode={editMode}
              presentationMode={!editMode}
            />
          </div>
        </ErrorBoundary>
        <div className={classes.rightContainer}>
          <Box displayPrint="none">
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
              {monsterSavedInHomebrew ? (
                <Tooltip title="No changes to be saved" placement="top-start">
                  <div>
                    <Button variant="contained" onClick={onSaveCustomCharacter} disabled fullWidth>
                      Save as homebrew character
                    </Button>
                  </div>
                </Tooltip>
              ) : (
                <Button variant="contained" onClick={onSaveCustomCharacter}>
                  Save as homebrew character
                </Button>
              )}
            </div>
          </Box>
          {currentMonster.imageElement && (
            <div className={`${classes.imageContainer}`}>
              <img alt={currentMonster.imageElement?.props.alt} src={`${currentMonster.imageElement?.props.src}`} />
            </div>
          )}
          {currentMonster.description && (
            <div className={classes.mainDescription}>
              <DescriptionBlock key={`description`} dangerouslySetInnerHTML={{ __html: currentMonster.description || '' }} />
            </div>
          )}
        </div>
      </div>
      <Box displayPrint="none">
        <Tooltip title="Toggle screenshot mode" placement="top-start">
          <div style={{ display: 'inline-block' }}>
            <ScreenshotButton onClick={onToggletMonsterActionsVisible} color={monsterActionsVisible ? 'default' : 'info'} />
          </div>
        </Tooltip>
        <div style={{ display: 'inline-block' }}>
          <EditButton onClick={onToggletEditMode} color={monsterActionsVisible ? 'default' : 'info'} />
        </div>
      </Box>
    </>
  )
}

export default MonsterStats
