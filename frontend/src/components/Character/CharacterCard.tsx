import StatsContainer from 'components/StatsContainer'
import React, { useEffect, useRef, useState } from 'react'

import useStyles from './CharacterCard.styles'
import TaperedRule from 'components/TaperedRule'
import _ from 'lodash'
import Character from 'domain/entities/Character'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import classNames from 'classnames'
import EditableText from '../CombatTracker/EditableText'
import EditableArmorClass from 'components/Character/EditableArmorClass'
import EditableDamageList from './EditableDamageList'
import { DamageType } from 'interfaces'
import EditableConditionList from './EditableConditionList'
import { APIReference } from 'domain/services/FifthESRDService'
import EditableSpeed from './EditableSpeed'
import EditableAbilityScores from './EditableAbilityScores'
import EditableShortDescription from './EditableShortDescription'
import EditableSavingThrows from './EditableSavingThrows'
import { CharacterCardContext } from 'services/context'
import EditableSkills from './EditableSkills'
import EditableLanguages from './EditableLanguages'
import EditableKeyValue from './EditableKeyValue'
import EditableChallengeRating from './EditableChallengeRating'
import EditableSenses from './EditableSenses'
import EditableActions from './EditableActions'
import EditableSpecialAbilities from './EditableSpecialAbilities'
import EditableDescription from './EditableDescription'
import { uuid } from '@dmtool/common'
import { flushSync } from 'react-dom'
import Stat from 'components/Stat'

interface CharacterCardProps {
  character: Character
  resizeable?: boolean
  className?: string
  editMode?: boolean
  presentationMode?: boolean
  onChange?: (key: string, value: Character) => void
  onCloseEditMode?: () => void
}

const CharacterCard: React.FC<CharacterCardProps> = (props) => {
  const {
    character,
    editMode = false,
    presentationMode = false,
    resizeable = true,
    className = '',
    onChange = () => {},
    onCloseEditMode = () => {}
  } = props
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const onChangeSaveDelay = 1000

  const [internalCharacter, setInternalCharacter] = useState(character.clone())
  const [onChangeTrigger, setOnChangeTrigger] = useState('')

  const statsContainerRef = React.createRef<HTMLDivElement>()

  const { classes } = useStyles()
  const cx = classNames.bind(classes)

  const hasActions = !_.isEmpty(internalCharacter.actions)
  const hasMoreThanOneSpecialAbility = internalCharacter.special_abilities.length > 1
  const hasMoreThanTwoSpecialAbilities = internalCharacter.special_abilities.length > 2
  const hasMoreThanOneAction = character.actions.length > 1
  const hasMoreThanTwoActions = internalCharacter.actions.length > 2
  const splitToColumns =
    (hasMoreThanOneSpecialAbility && hasActions) ||
    hasMoreThanTwoActions ||
    hasMoreThanTwoSpecialAbilities ||
    hasMoreThanOneAction ||
    editMode

  useEffect(() => {
    setInternalCharacter(character.clone())
  }, [character])

  useEffect(() => {
    if (editMode && statsContainerRef.current) {
      statsContainerRef.current.style.width = ''
      statsContainerRef.current.style.height = ''
    }
  }, [editMode, statsContainerRef])

  useEffect(() => {
    if (onChangeTrigger) {
      saveConditionally.current('', internalCharacter)
    }
  }, [onChangeTrigger]) // cannot add internalCharacter here or it will cause an infinite loop

  const onChangeName = (value: string | number) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone({ name: value.toString() })
      setOnChangeTrigger(uuid())
      return characterClone
    })
  }

  const onChangeHitPoints = (hitPoints: string | number) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      const newHitPoints = parseInt(hitPoints.toString())
      const hitPointsHaveChanged = characterClone.hit_points !== newHitPoints
      if (hitPointsHaveChanged) {
        characterClone.hit_points = newHitPoints
        setOnChangeTrigger(uuid())
        return characterClone
      }
      return character
    })
  }

  const onChangeDamageResistance = (resistances: DamageType[]) => {
    setInternalCharacter((character) => {
      const hasChanged = !_.isEqual(character.damage_resistances, resistances)
      if (hasChanged) {
        const characterClone = character.clone()
        characterClone.damage_resistances = resistances
        setOnChangeTrigger(uuid())
        return characterClone
      }
      return character
    })
  }

  const onChangeDamageVulnerabilities = (vulnerabilities: DamageType[]) => {
    setInternalCharacter((character) => {
      const hasChanged = !_.isEqual(character.damage_vulnerabilities, vulnerabilities)
      if (hasChanged) {
        const characterClone = character.clone()
        characterClone.damage_vulnerabilities = vulnerabilities
        setOnChangeTrigger(uuid())
        return characterClone
      }
      return character
    })
  }

  const onChangeDamageImmunities = (immunities: DamageType[]) => {
    setInternalCharacter((character) => {
      const hasChanged = !_.isEqual(character.damage_immunities, immunities)
      if (hasChanged) {
        const characterClone = character.clone()
        characterClone.damage_immunities = immunities
        setOnChangeTrigger(uuid())
        return characterClone
      }
      return character
    })
  }

  const onChangeConditionImmunities = (immunities: APIReference[]) => {
    setInternalCharacter((character) => {
      const hasChanged = !_.isEqual(character.condition_immunities, immunities)
      if (hasChanged) {
        const characterClone = character.clone()
        characterClone.condition_immunities = immunities
        setOnChangeTrigger(uuid())
        return characterClone
      }
      return character
    })
  }

  const onChangeLanguages = (languages: string) => {
    setInternalCharacter((character) => {
      const hasChanged = !_.isEqual(character.languages, languages)
      if (hasChanged) {
        const characterClone = character.clone()
        characterClone.languages = languages
        setOnChangeTrigger(uuid())
        return characterClone
      }
      return character
    })
  }

  const onChangeProficiencyBonus = (value: string | number) => {
    setInternalCharacter((character) => {
      const hasChanged = !_.isEqual(character.proficiency_bonus, parseInt(value.toString()))
      if (hasChanged) {
        const characterClone = character.clone()
        characterClone.proficiency_bonus = parseInt(value.toString())
        setOnChangeTrigger(uuid())
        return characterClone
      }
      return character
    })
  }

  // NOTE: DO NOT PASS internalCharacter to any child component below
  // use CharacterCardContext instead to share state
  // ========================
  const setCharacter = (_character: Character) => {
    setTimeout(() => {
      flushSync(() => {
        setInternalCharacter((_currentCharacter) => {
          const hasChanged = !_.isEqual(_currentCharacter.toJSON(), _character.toJSON())
          if (hasChanged) {
            return _character
          }
          return _currentCharacter
        })
      })
      setOnChangeTrigger(uuid())
    }, 0)
  }

  const saveConditionally = useRef(
    _.throttle(
      (key: string, characterToSave: Character) => {
        if (presentationMode) {
          onChange(key || '', characterToSave)
        } else {
          _.delay(onChange, onChangeSaveDelay, key, characterToSave)
        }
      },
      1500,
      { trailing: true }
    )
  )

  const onSave = () => {
    onChange('', internalCharacter)
    onCloseEditMode()
  }

  return (
    <StatsContainer
      className={cx(className, {
        [classes.root]: true,
        [classes.staticWidthMedium]: hasActions && !splitToColumns,
        [classes.staticWidthLarge]: splitToColumns,
        [classes.fullWidth]: isSmall
      })}
      resizeable={resizeable && !editMode}
      ref={statsContainerRef}
    >
      {/* Context for sub edit components inside CharacterCard to update character in card internal state instead of setting atoms */}
      <CharacterCardContext.Provider
        value={{
          character: internalCharacter,
          setCharacter
        }}
      >
        <div
          className={cx({
            [classes.columns]: splitToColumns
          })}
        >
          <EditableText
            id={`character-name`}
            textClass={`${classes.header} ${classes.name}`}
            value={internalCharacter.name}
            textWidth={120}
            label="Name"
            hideLabelInTextMode={true}
            onChange={onChangeName}
            editMode={editMode}
          />
          <EditableShortDescription editMode={editMode} presentationMode={presentationMode} />
          {!editMode && <TaperedRule />}
          <div
            className={classes.statsContainer}
            style={{
              breakInside: editMode ? 'auto' : 'avoid'
            }}
          >
            <div className={classes.baseStatsContainer}>
              <EditableArmorClass editMode={editMode} presentationMode={presentationMode} />
              <EditableText
                id="hit-points"
                label="Hit Points"
                value={internalCharacter.hit_points_cap}
                onChange={onChangeHitPoints}
                editWidth={6}
                editMode={editMode}
              />
              {(!_.isEmpty(internalCharacter.speed) || editMode) && (
                <EditableSpeed editMode={editMode} presentationMode={presentationMode} />
              )}
            </div>
            {(internalCharacter.hasAbilityScores() || editMode) && (
              <>
                <div>
                  {!editMode && <TaperedRule />}
                  <EditableAbilityScores editMode={editMode} presentationMode={presentationMode} />
                </div>
                {!editMode && <TaperedRule />}
              </>
            )}

            {(!_.isEmpty(internalCharacter.saving_throws) || editMode) && (
              <EditableSavingThrows editMode={editMode} presentationMode={presentationMode} />
            )}
            {(!_.isEmpty(internalCharacter.skills) || editMode) && (
              <EditableSkills editMode={editMode} presentationMode={presentationMode} />
            )}
            {!_.isEmpty(internalCharacter.conditions) && <Stat header="Conditions" value={internalCharacter.conditions_label} />}
            {(!_.isEmpty(internalCharacter.condition_immunities) || editMode) && (
              <EditableConditionList
                header="Condition Immunities"
                list={internalCharacter.condition_immunities}
                onChange={onChangeConditionImmunities}
                editMode={editMode}
                presentationMode={presentationMode}
              />
            )}
            {(!_.isEmpty(internalCharacter.damage_resistances) || editMode) && (
              <EditableDamageList
                header="Damage Resistances"
                list={internalCharacter.damage_resistances}
                onChange={onChangeDamageResistance}
                editMode={editMode}
                presentationMode={presentationMode}
              />
            )}
            {(!_.isEmpty(internalCharacter.damage_vulnerabilities) || editMode) && (
              <EditableDamageList
                header="Damage Vulnerabilities"
                list={internalCharacter.damage_vulnerabilities}
                onChange={onChangeDamageVulnerabilities}
                editMode={editMode}
                presentationMode={presentationMode}
              />
            )}
            {(!_.isEmpty(internalCharacter.damage_immunities) || editMode) && (
              <EditableDamageList
                header="Damage Immunities"
                list={internalCharacter.damage_immunities}
                onChange={onChangeDamageImmunities}
                editMode={editMode}
                presentationMode={presentationMode}
              />
            )}
            {(!_.isEmpty(internalCharacter.senses) || editMode) && (
              <EditableSenses editMode={editMode} presentationMode={presentationMode} />
            )}
            {(!_.isEmpty(internalCharacter.languages) || editMode) && (
              <EditableLanguages
                language={internalCharacter.languages}
                onChange={onChangeLanguages}
                editMode={editMode}
                presentationMode={presentationMode}
              />
            )}
            <div style={{ display: 'flex', gap: '0.5em' }}>
              {(typeof internalCharacter.challenge_rating !== 'undefined' || editMode) && (
                <EditableChallengeRating editMode={editMode} presentationMode={presentationMode} />
              )}
              {(!!internalCharacter.proficiency_bonus || editMode) && (
                <EditableKeyValue
                  id="proficiency-bonus"
                  label="Proficiency Bonus"
                  type="number"
                  value={internalCharacter.proficiency_bonus}
                  valueLabel={internalCharacter.proficiency_bonus_label}
                  onChange={onChangeProficiencyBonus}
                  editWidth={10}
                  editMode={editMode}
                />
              )}
            </div>
            {!editMode && <TaperedRule />}
          </div>
          {(!_.isEmpty(internalCharacter.special_abilities) || editMode) && (
            <EditableSpecialAbilities editMode={editMode} presentationMode={presentationMode} />
          )}
          {(!_.isEmpty(internalCharacter.actions) || editMode) && (
            <EditableActions editMode={editMode} presentationMode={presentationMode} />
          )}
          {(!_.isEmpty(internalCharacter.description) || editMode) && (
            <EditableDescription editMode={editMode} presentationMode={presentationMode} />
          )}
          {editMode && (
            <div className={classes.saveButtonContainer}>
              <Button variant="contained" size="large" onClick={onSave}>
                Close
              </Button>
            </div>
          )}
        </div>
      </CharacterCardContext.Provider>
    </StatsContainer>
  )
}

export default CharacterCard
