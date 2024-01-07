import StatsContainer from 'components/StatsContainer'
import React, { useEffect, useRef, useState } from 'react'

import useStyles from './CharacterCard.styles'
import TaperedRule from 'components/TaperedRule'
import _ from 'lodash'
import Character from 'domain/entities/Character'
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material'
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
import { uuid } from 'utils/utils'

interface CharacterCardProps {
  character: Character
  resizeable?: boolean
  className?: string
  editMode?: boolean
  presentationMode?: boolean
  unsaved?: boolean
  onChange?: (key: string, value: Character) => void
  onCloseEditMode?: () => void
}

const CharacterCard: React.FC<CharacterCardProps> = (props) => {
  const {
    character,
    editMode = false,
    presentationMode = false,
    unsaved = false,
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
  const splitToColumns = (hasMoreThanOneSpecialAbility && hasActions) || hasMoreThanTwoActions || hasMoreThanTwoSpecialAbilities || hasMoreThanOneAction

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
  }, [onChangeTrigger])

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
      const characterClone = character.clone()
      characterClone.damage_resistances = resistances
      setOnChangeTrigger(uuid())
      return characterClone
    })
  }

  const onChangeDamageVulnerabilities = (vulnerabilities: DamageType[]) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.damage_vulnerabilities = vulnerabilities
      setOnChangeTrigger(uuid())
      return characterClone
    })
  }

  const onChangeDamageImmunities = (immunities: DamageType[]) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.damage_immunities = immunities
      setOnChangeTrigger(uuid())
      return characterClone
    })
  }

  const onChangeConditionImmunities = (immunities: APIReference[]) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.condition_immunities = immunities
      setOnChangeTrigger(uuid())
      return characterClone
    })
  }

  const onChangeLanguages = (languages: string) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.languages = languages
      setOnChangeTrigger(uuid())
      return characterClone
    })
  }

  const onChangeProficiencyBonus = (value: string | number) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.proficiency_bonus = parseInt(value.toString())
      setOnChangeTrigger(uuid())
      return characterClone
    })
  }

  // NOTE: DO NOT PASS internalCharacter to any child component below
  // use CharacterCardContext instead to share state
  // ========================
  const setCharacter = (_character: Character) => {
    setInternalCharacter((_currentCharacter) => _currentCharacter.clone(_character.toJSON()))
    setOnChangeTrigger(uuid())
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
            onChange={onChangeName}
            editMode={editMode}
          />
          <EditableShortDescription editMode={editMode} presentationMode={presentationMode} />
          <TaperedRule />
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
              {(!_.isEmpty(internalCharacter.speed) || editMode) && <EditableSpeed editMode={editMode} presentationMode={presentationMode} />}
            </div>
            {(internalCharacter.hasAbilityScores() || editMode) && (
              <>
                <div>
                  <TaperedRule />
                  <EditableAbilityScores editMode={editMode} presentationMode={presentationMode} />
                </div>
                <TaperedRule />
              </>
            )}

            {(!_.isEmpty(internalCharacter.saving_throws) || editMode) && <EditableSavingThrows editMode={editMode} presentationMode={presentationMode} />}
            {(!_.isEmpty(internalCharacter.skills) || editMode) && <EditableSkills editMode={editMode} presentationMode={presentationMode} />}
            {!_.isEmpty(internalCharacter.conditions) && (
              <div>
                <span className={`${classes.statHeader}`}>Conditions</span>
                <span className={classes.statValue}>{internalCharacter.conditions_label}</span>
              </div>
            )}
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
            {(!_.isEmpty(internalCharacter.senses) || editMode) && <EditableSenses editMode={editMode} presentationMode={presentationMode} />}
            {(!_.isEmpty(internalCharacter.languages) || editMode) && (
              <EditableLanguages language={internalCharacter.languages} onChange={onChangeLanguages} editMode={editMode} presentationMode={presentationMode} />
            )}
            <div style={{ display: 'flex', gap: '0.5em' }}>
              {(!!internalCharacter.challenge_rating || editMode) && <EditableChallengeRating editMode={editMode} presentationMode={presentationMode} />}
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
            <TaperedRule />
          </div>
          {(!_.isEmpty(internalCharacter.special_abilities) || editMode) && (
            <div className={classes.actionsContainer}>
              {internalCharacter.special_abilities.map((specialAbility, index) => {
                return (
                  <Typography key={index} variant="body2" className={classes.actionContainer}>
                    <span className={`${classes.actionName}`}>{specialAbility.name}</span>
                    <span className={classes.actionDescription}>{specialAbility.desc}</span>
                  </Typography>
                )
              })}
            </div>
          )}
          {(!_.isEmpty(internalCharacter.actions) || editMode) && (
            <div className={classes.actionsContainer}>
              <Typography variant="h2" className={`${classes.header} ${classes.actionsHeader}`}>
                Actions
              </Typography>
              <>
                {internalCharacter.actions.map((action, index) => {
                  return (
                    <Typography key={index} variant="body2" className={classes.actionContainer}>
                      <span className={`${classes.actionName}`}>{action.name}</span>
                      <span className={classes.actionDescription}>{action.desc}</span>
                    </Typography>
                  )
                })}
              </>
            </div>
          )}
          {editMode && (
            <Button variant="contained" size="small" onClick={onSave}>
              Save
            </Button>
          )}
        </div>
      </CharacterCardContext.Provider>
    </StatsContainer>
  )
}

export default CharacterCard
