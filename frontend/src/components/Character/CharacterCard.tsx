import StatsContainer from 'components/StatsContainer'
import React, { useEffect, useState } from 'react'

import useStyles from './CharacterCard.styles'
import TaperedRule from 'components/TaperedRule'
import _ from 'lodash'
import Character from 'domain/entities/Character'
import { Typography, useMediaQuery, useTheme } from '@mui/material'
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

interface CharacterCardProps {
  character: Character
  resizeable?: boolean
  className?: string
  editMode?: boolean
  onChange?: (key: string, value: Character) => void
}

const CharacterCard: React.FC<CharacterCardProps> = (props) => {
  const { character, editMode = false, resizeable = true, className = '', onChange = () => {} } = props
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const [internalCharacter, setInternalCharacter] = useState(character.clone())

  const statsContainerRef = React.createRef<HTMLDivElement>()

  const { classes } = useStyles()
  const cx = classNames.bind(classes)

  //const hasSpecialAbilities = _.isEmpty(character.special_abilities) // todo, use later?
  const hasActions = !_.isEmpty(internalCharacter.actions)
  const hasMoreThanOneSpecialAbility = internalCharacter.special_abilities.length > 1
  const hasMoreThanTwoSpecialAbilities = internalCharacter.special_abilities.length > 2
  //const hasMoreThanOneAction = character.actions.length > 1
  const hasMoreThanTwoActions = internalCharacter.actions.length > 2
  const splitToColumns = (hasMoreThanOneSpecialAbility && hasActions) || hasMoreThanTwoActions || hasMoreThanTwoSpecialAbilities

  useEffect(() => {
    setInternalCharacter(character.clone())
  }, [character])

  useEffect(() => {
    if (editMode && statsContainerRef.current) {
      statsContainerRef.current.style.width = ''
      statsContainerRef.current.style.height = ''
    }
  }, [editMode, statsContainerRef])

  const onChangeName = (value: string | number) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone({ name: value.toString() })
      onChange('name', characterClone)
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
        onChange('hit_points', characterClone)
        return characterClone
      }
      return character
    })
  }

  const onChangeDamageResistance = (resistances: DamageType[]) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.damage_resistances = resistances
      onChange('damage_resistances', characterClone)
      return characterClone
    })
  }

  const onChangeDamageVulnerabilities = (vulnerabilities: DamageType[]) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.damage_vulnerabilities = vulnerabilities
      onChange('damage_vulnerabilities', characterClone)
      return characterClone
    })
  }

  const onChangeDamageImmunities = (immunities: DamageType[]) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.damage_immunities = immunities
      onChange('damage_immunities', characterClone)
      return characterClone
    })
  }

  const onChangeConditionImmunities = (immunities: APIReference[]) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.condition_immunities = immunities
      onChange('condition_immunities', characterClone)
      return characterClone
    })
  }

  const onChangeLanguages = (languages: string) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.languages = languages
      onChange('condition_immunities', characterClone)
      return characterClone
    })
  }

  const onChangeProficiencyBonus = (value: string | number) => {
    setInternalCharacter((character) => {
      const characterClone = character.clone()
      characterClone.proficiency_bonus = parseInt(value.toString())
      onChange('proficiency_bonus', characterClone)
      return characterClone
    })
  }

  // NOTE: DO NOT PASS internalCharacter to any child component below
  // use CharacterCardContext instead to share state
  // ========================

  const setCharacter = (_character: Character) => {
    setInternalCharacter((_currentCharacter) => _currentCharacter.clone(_character.toJSON()))
    onChange('', _character)
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
          <EditableShortDescription editMode={editMode} />
          <TaperedRule />
          <div
            className={classes.statsContainer}
            style={{
              breakInside: editMode ? 'auto' : 'avoid'
            }}
          >
            <div className={classes.baseStatsContainer}>
              <EditableArmorClass editMode={editMode} />
              <EditableText
                id="hit-points"
                label="Hit Points"
                value={internalCharacter.hit_points_cap}
                onChange={onChangeHitPoints}
                editWidth={6}
                editMode={editMode}
              />
              {internalCharacter.speed && <EditableSpeed editMode={editMode} />}
            </div>
            {internalCharacter.hasAbilityScores() && (
              <>
                <div>
                  <TaperedRule />
                  <EditableAbilityScores editMode={editMode} />
                </div>
                <TaperedRule />
              </>
            )}

            {!_.isEmpty(internalCharacter.saving_throws) && <EditableSavingThrows editMode={editMode} />}
            {!_.isEmpty(internalCharacter.skills) && <EditableSkills editMode={editMode} />}
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
              />
            )}
            {(!_.isEmpty(internalCharacter.damage_resistances) || editMode) && (
              <EditableDamageList
                header="Damage Resistances"
                list={internalCharacter.damage_resistances}
                onChange={onChangeDamageResistance}
                editMode={editMode}
              />
            )}
            {(!_.isEmpty(internalCharacter.damage_vulnerabilities) || editMode) && (
              <EditableDamageList
                header="Damage Vulnerabilities"
                list={internalCharacter.damage_vulnerabilities}
                onChange={onChangeDamageVulnerabilities}
                editMode={editMode}
              />
            )}
            {(!_.isEmpty(internalCharacter.damage_immunities) || editMode) && (
              <EditableDamageList
                header="Damage Immunities"
                list={internalCharacter.damage_immunities}
                onChange={onChangeDamageImmunities}
                editMode={editMode}
              />
            )}
            {!_.isEmpty(internalCharacter.senses) && <EditableSenses editMode={editMode} />}
            {!_.isEmpty(internalCharacter.languages) && (
              <EditableLanguages language={internalCharacter.languages} onChange={onChangeLanguages} editMode={editMode} />
            )}
            <div style={{ display: 'flex', gap: '0.5em' }}>
              {!!internalCharacter.challenge_rating && <EditableChallengeRating editMode={editMode} />}
              {!!internalCharacter.proficiency_bonus && (
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
          {!_.isEmpty(internalCharacter.special_abilities) && (
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
          {!_.isEmpty(internalCharacter.actions) && (
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
        </div>
      </CharacterCardContext.Provider>
    </StatsContainer>
  )
}

export default CharacterCard
