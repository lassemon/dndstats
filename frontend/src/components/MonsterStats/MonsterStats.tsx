import React, { HTMLAttributes, useEffect, useMemo, useState } from 'react'
import { CombatAtom, combatTrackerAtom, customCharactersAtom, monsterAtom } from 'infrastructure/dataAccess/atoms'

import useStyles from './MonsterStats.styles'
import { Box } from '@mui/material'
import { MonsterListOption, emptyMonster } from 'domain/entities/Monster'
import { getMonsterList } from 'api/monsters'
import Character from 'domain/entities/Character'
import CharacterCard from 'components/Character/CharacterCard'
import _ from 'lodash'
import { useOrientation } from 'utils/hooks'
import { useAtom } from 'jotai'
import LoadingIndicator from 'components/LoadingIndicator'
import classNames from 'classnames'
import Showdown from 'showdown'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from 'components/ErrorFallback'

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

interface MonsterStatsProps {
  screenshotMode?: boolean
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const MonsterStats: React.FC<MonsterStatsProps> = ({ editMode, setEditMode }) => {
  const { classes } = useStyles()
  const cx = classNames.bind(classes)
  const [currentMonster, setCurrentMonster] = useAtom(useMemo(() => monsterAtom, []))

  const [customCharacters, setCustomCharacters] = useAtom(useMemo(() => customCharactersAtom, []))
  const customCharacterList = customCharacters?.characters || []
  const [combatTracker] = useAtom(useMemo(() => combatTrackerAtom, []))

  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

  const [monsterList, setMonsterList] = useState<MonsterListOption[]>([emptyMonster] as MonsterListOption[])
  const [loadingMonsterList, setLoadingMonsterList] = useState(false)

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

  const onCloseEditMode = () => {
    setEditMode(false)
  }

  if (!currentMonster) {
    return <LoadingIndicator />
  }

  return (
    <>
      <div>
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
      <Box displayPrint="none"></Box>
    </>
  )
}

export default MonsterStats
