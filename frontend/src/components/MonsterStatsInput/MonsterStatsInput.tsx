import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import { useAtom } from 'jotai'
import React, { useEffect, useMemo, useState } from 'react'
import { CombatAtom, combatTrackerAtom, customCharactersAtom, errorAtom, monsterAtom } from 'infrastructure/dataAccess/atoms'
import { makeStyles } from 'tss-react/mui'
import DownloadJSON from 'components/DownloadJSON'
import UploadJSON from 'components/UploadJSON'
import Character from 'domain/entities/Character'
import { Autocomplete, Button, ButtonGroup, CircularProgress, Switch, TextField, Tooltip } from '@mui/material'
import { AutocompleteGroupHeader, AutocompleteGroupItems } from 'components/Autocomplete/AutocompleteGroup'
import { AutoCompleteItem } from 'components/Autocomplete/AutocompleteItem'
import { MonsterListOption, emptyMonster } from 'domain/entities/Monster'
import { FifthESRDMonster } from 'domain/services/FifthESRDService'
import { PlayerType } from 'interfaces'
import { Source } from '@dmtool/domain'
import { getMonster, getMonsterList } from 'api/monsters'
import _ from 'lodash'
import { upsertToArray } from 'utils/utils'
import ScreenshotButton from 'components/ScreenshotButton'
import DeleteButton from 'components/DeleteButton'
import EditButton from 'components/EditButton'
import { BrowserImageProcessingService } from '@dmtool/application'

const imageProcessingService = new BrowserImageProcessingService()

const useStyles = makeStyles()(() => ({
  buttons: {
    display: 'flex',
    gap: '1em',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  uploadButtons: {
    display: 'flex',
    gap: '1em'
  }
}))

interface MonsterStatsInputProps {
  screenshotMode?: boolean
  setScreenshotMode?: React.Dispatch<React.SetStateAction<boolean>>
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

const mapCustomCharacterToMonsterListOption = (customCharacter: Character) => {
  return {
    id: customCharacter.id,
    name: customCharacter.name,
    url: undefined,
    source: customCharacter.source
  }
}

export const MonsterStatsInput: React.FC<MonsterStatsInputProps> = ({ screenshotMode, setScreenshotMode, editMode, setEditMode }) => {
  const [currentMonster, setCurrentMonster] = useAtom(useMemo(() => monsterAtom, []))
  const [selectedMonster, setSelectedMonster] = useState(emptyMonster)
  const [loadingMonsterList, setLoadingMonsterList] = useState(false)
  const [combatTracker] = useAtom(useMemo(() => combatTrackerAtom, []))

  const [customCharacters, setCustomCharacters] = useAtom(useMemo(() => customCharactersAtom, []))
  const [monsterList, setMonsterList] = useState<MonsterListOption[]>([emptyMonster] as MonsterListOption[])
  const customCharacterList = customCharacters?.characters || []
  const existingCustomCharacter = customCharacterList.find((customCharacter) => customCharacter.id === currentMonster?.id)
  const monsterSavedInHomebrew = currentMonster?.isEqual(existingCustomCharacter)

  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const { classes } = useStyles()

  useEffect(() => {
    if (combatTracker) {
      syncCombatTrackerWithCustomCharacterList(combatTracker)
    }

    fetchMonsterList()
  }, [])

  const fetchMonsterList = () => {
    const fetchData = async () => {
      if (!loadingMonsterList) {
        setLoadingMonsterList(true)
        const monsters = await getMonsterList()
        const newMonsterList = _.unionBy(monsterList, monsters, 'name')
        setMonsterList(newMonsterList)
        setLoadingMonsterList(false)
      }
    }

    fetchData().catch((error) => {
      setLoadingMonsterList(false)
      console.error(error)
    })
  }

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

  const onDeleteImage = () => {
    setCurrentMonster((monster) => {
      return monster?.clone({
        imageElement: React.createElement('img', {
          width: 200,
          alt: '',
          src: '',
          hash: 0
        })
      })
    })
  }

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = (event.target.files || [])[0]
    if (imageFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event && event.target) {
          let base64String = (event.target.result || '') as string
          imageProcessingService.resizeImage(base64String, { maxWidth: 320 }, (base64Image: string) => {
            base64String = base64Image
          })

          const imgtag = React.createElement('img', {
            width: 200,
            alt: imageFile.name,
            src: base64String,
            hash: Date.now()
          })
          setCurrentMonster((monster) => {
            return monster?.clone({
              imageElement: imgtag
            })
          })
        }
      }
      reader.readAsDataURL(imageFile)
    }
  }

  const onUploadMonster = (monster?: { [key: string]: any }) => {
    try {
      if (monster) {
        const parsedMonster = Character.fromJSON(monster)
        setCurrentMonster(parsedMonster)
      }
    } catch (error) {
      setError(new Error(error?.toString()))
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

  const onSaveCustomCharacter = () => {
    if (currentMonster) {
      let characterToBeSaved = currentMonster.clone({ source: Source.HomeBrew })
      const existingCharacter = monsterList.concat(customCharacterList).find((monster) => monster.id === currentMonster.id)
      const characterExists = !!existingCharacter
      const tryingToOverwriteNonHomebrewCharacter = characterExists && existingCharacter?.source !== Source.HomeBrew

      if (tryingToOverwriteNonHomebrewCharacter) {
        setCurrentMonster((currentMonster) => {
          if (currentMonster) {
            const monsterWithNameCount = (customCharacterList || []).filter((customCharacter) =>
              customCharacter.id.includes(currentMonster.id)
            ).length
            const newName = `${currentMonster.name} #${monsterWithNameCount + 1}`
            characterToBeSaved = characterToBeSaved?.clone({ name: newName })
            return characterToBeSaved
          }
        })
      }
      setCustomCharacters((_customCharacters) => {
        return {
          ..._customCharacters,
          characters: upsertToArray(customCharacterList, characterToBeSaved, 'id')
        }
      })
    }
  }

  const onSelectCustomCharacter = (index: number) => (event: React.MouseEvent) => {
    if (customCharacterList[index]) {
      setCurrentMonster(customCharacterList[index])
    }
  }

  const onDeleteCustomCharacter = (index: number) => () => {
    setCustomCharacters((_customCharacters) => {
      const charactersCopy = [..._customCharacters.characters]
      charactersCopy.splice(index, 1)
      return {
        ..._customCharacters,
        characters: charactersCopy
      }
    })
  }

  const onToggleScreenshotMode = () => {
    if (setScreenshotMode) {
      setScreenshotMode((_screenshotMode) => !_screenshotMode)
    }
  }

  const onToggletEditMode = () => {
    setEditMode((editMode) => !editMode)
  }

  if (!currentMonster) {
    return null
  }

  return (
    <StatsInputContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1em' }}>
        <Autocomplete
          id={`select-monster-dropdown`}
          blurOnSelect
          clearOnBlur
          fullWidth
          disableClearable
          filterSelectedOptions
          groupBy={(option) => option.source}
          value={selectedMonster}
          loading={loadingMonsterList}
          options={[...monsterList, ...customCharacterList.map(mapCustomCharacterToMonsterListOption)].sort((a, b) =>
            b.source.localeCompare(a.source)
          )}
          onChange={onSelectMonster}
          getOptionLabel={(option) => (typeof option !== 'string' ? option?.name : '')}
          PaperComponent={AutoCompleteItem}
          renderGroup={(params) => (
            <li key={params.key}>
              <AutocompleteGroupHeader>{params.group.replaceAll('_', ' ')}</AutocompleteGroupHeader>
              <AutocompleteGroupItems>{params.children}</AutocompleteGroupItems>
            </li>
          )}
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
            width: '16em'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1em' }}>
          <Tooltip title="Toggle screenshot mode" placement="top-end">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <ScreenshotButton
                onClick={onToggleScreenshotMode}
                color={screenshotMode ? 'secondary' : 'default'}
                sx={{ paddingBottom: 0 }}
              />
              <Switch onClick={onToggleScreenshotMode} checked={screenshotMode} sx={{ marginTop: '-10px' }} color="secondary" />
            </div>
          </Tooltip>
          <Tooltip title="Toggle edit mode" placement="top-end">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <EditButton onClick={onToggletEditMode} color={editMode ? 'secondary' : 'default'} sx={{ paddingBottom: 0 }} />
              <Switch onClick={onToggletEditMode} checked={editMode} sx={{ marginTop: '-10px' }} color="secondary" />
            </div>
          </Tooltip>
        </div>
      </div>

      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />
      <div className={classes.buttons}>
        <div className={classes.uploadButtons}>
          <UploadJSON onUpload={onUploadMonster}>Import Monster</UploadJSON>
          <DownloadJSON fileName={currentMonster.id} data={currentMonster}>
            Export Monster
          </DownloadJSON>
        </div>
        {monsterSavedInHomebrew ? (
          <Tooltip title="No changes to be saved" placement="top-start">
            <div style={{ textAlign: 'end' }}>
              <Button variant="contained" onClick={onSaveCustomCharacter} disabled>
                Save as homebrew character
              </Button>
            </div>
          </Tooltip>
        ) : (
          <div style={{ textAlign: 'end' }}>
            <Button variant="contained" onClick={onSaveCustomCharacter}>
              Save as homebrew character
            </Button>
          </div>
        )}
      </div>

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
    </StatsInputContainer>
  )
}

export default MonsterStatsInput
