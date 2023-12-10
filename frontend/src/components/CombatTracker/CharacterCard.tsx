import StatsContainer from 'components/StatsContainer'
import React, { useEffect, useState } from 'react'

import useStyles from './CharacterCard.styles'
import TaperedRule from 'components/TaperedRule'
import _ from 'lodash'
import Character from 'domain/entities/Character'
import { Typography } from '@mui/material'
import classNames from 'classnames'
import EditableText from './EditableText'

interface CharacterCardProps {
  character: Character
  resizeable?: boolean
  className?: string
  onChange?: (key: string, value: Character) => void
}

const CharacterCard: React.FC<CharacterCardProps> = (props) => {
  const { character: _character, resizeable = true, className = '', onChange = () => {} } = props

  const [character, setCharacter] = useState(_character)

  const { classes } = useStyles()
  const cx = classNames.bind(classes)

  //const hasSpecialAbilities = _.isEmpty(character.special_abilities) // todo, use later?
  const hasActions = !_.isEmpty(character.actions)
  const hasMoreThanOneSpecialAbility = character.special_abilities.length > 1
  const hasMoreThanOneAction = character.actions.length > 1
  const hasMoreThanTwoActions = character.actions.length > 2
  const splitToColumns = (hasMoreThanOneSpecialAbility && hasMoreThanOneAction) || hasMoreThanTwoActions

  useEffect(() => {
    setCharacter(props.character)
  }, [props.character])

  const internalOnChangeName = (value: string) => {
    setCharacter((character) => {
      const characterClone = character.clone({ name: value })
      onChange('name', characterClone)
      return characterClone
    })
  }

  return (
    <StatsContainer
      className={cx(className, {
        [classes.root]: true,
        [classes.staticWidthMedium]: hasActions && !splitToColumns,
        [classes.staticWidthLarge]: splitToColumns
      })}
      resizeable={resizeable}
    >
      <div
        className={cx({
          [classes.columns]: splitToColumns
        })}
      >
        <EditableText
          id={`character-name`}
          //className={`${classes.header} ${classes.name}`}
          textFieldClass={`${classes.header} ${classes.name}`}
          textClass={`${classes.header} ${classes.name}`}
          value={character.name}
          textWidth={120}
          editWidth={10}
          onChange={internalOnChangeName}
        />
        <Typography variant="h2" className={`${classes.shortDescription}`}>
          {character.short_description}
        </Typography>
        <TaperedRule />
        <div className={classes.statsContainer}>
          <div className={classes.baseStatsContainer}>
            <div className={classes.baseStat}>
              <span className={classes.statHeader}>Armor Class</span>
              <span className={classes.statValue}>
                {character.armor_class_label} {}
              </span>
            </div>
            <div className={classes.baseStat}>
              <span className={classes.statHeader}>Hit Points</span>
              <span className={classes.statValue}>
                {character.current_hit_points + (character.temporary_hit_points || 0)} / {character.hit_points_cap}
              </span>
            </div>
            {character.speed && (
              <div className={classes.baseStat}>
                <span className={classes.statHeader}>Speed</span>
                <span className={classes.statValue}>{character.speed_label}</span>
              </div>
            )}
          </div>
          {character.hasAbilityScores() && (
            <>
              <div>
                <TaperedRule />
                <div className={classes.abilityScores}>
                  <div className={classes.statHeader}>STR</div>
                  <div className={classes.statHeader}>DEX</div>
                  <div className={classes.statHeader}>CON</div>
                  <div className={classes.statHeader}>INT</div>
                  <div className={classes.statHeader}>WIS</div>
                  <div className={classes.statHeader}>CHA</div>
                  <div className={classes.rowBreak} />
                  <div className={classes.statValue}>
                    <span>{character.strenght_label}</span>
                  </div>
                  <div className={classes.statValue}>
                    <span>{character.dexterity_label}</span>
                  </div>
                  <div className={classes.statValue}>
                    <span>{character.constitution_label}</span>
                  </div>
                  <div className={classes.statValue}>
                    <span>{character.intelligence_label}</span>
                  </div>
                  <div className={classes.statValue}>
                    <span>{character.wisdom_label}</span>
                  </div>
                  <div className={classes.statValue}>
                    <span>{character.charisma_label}</span>
                  </div>
                </div>
              </div>
              <TaperedRule />
            </>
          )}

          {!_.isEmpty(character.saving_throws) && (
            <div>
              <span className={`${classes.statHeader}`}>Saving Throws</span>
              <span className={classes.statValue}>{character.saving_throws_label}</span>
            </div>
          )}
          {!_.isEmpty(character.skills) && (
            <div>
              <span className={`${classes.statHeader}`}>Skills</span>
              <span className={classes.statValue}>{character.skills_label}</span>
            </div>
          )}
          {!_.isEmpty(character.conditions) && (
            <div>
              <span className={`${classes.statHeader}`}>Conditions</span>
              <span className={classes.statValue}>{character.conditions_label}</span>
            </div>
          )}
          {!_.isEmpty(character.conditions) && (
            <div>
              <span className={`${classes.statHeader}`}>Condition Immunities</span>
              <span className={classes.statValue}>{character.condition_immunities_label}</span>
            </div>
          )}
          {!_.isEmpty(character.damage_resistances) && (
            <div>
              <span className={`${classes.statHeader}`}>Damage Resistances</span>
              <span className={classes.statValue}>{character.damage_resistances_label}</span>
            </div>
          )}
          {!_.isEmpty(character.damage_vulnerabilities) && (
            <div>
              <span className={`${classes.statHeader}`}>Damage Vulnerabilities</span>
              <span className={classes.statValue}>{}</span>
            </div>
          )}
          {!_.isEmpty(character.damage_immunities) && (
            <div>
              <span className={`${classes.statHeader}`}>Damage Immunities</span>
              <span className={classes.statValue}>{character.damage_immunities.join(', ')}</span>
            </div>
          )}
          {!_.isEmpty(character.senses) && (
            <div>
              <span className={`${classes.statHeader}`}>Senses</span>
              <span className={classes.statValue}>{character.senses_label}</span>
            </div>
          )}
          {!_.isEmpty(character.languages) && (
            <div>
              <span className={`${classes.statHeader}`}>Languages</span>
              <span className={classes.statValue}>{character.languages}</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5em' }}>
            {!!character.challenge_rating && (
              <div>
                <span className={`${classes.statHeader}`}>Challenge Rating</span>
                <span className={classes.statValue}>{character.challenge_rating_label}</span>
              </div>
            )}
            {!!character.proficiency_bonus && (
              <div>
                <span className={`${classes.statHeader}`}>Proficiency Bonus</span>
                <span className={classes.statValue}>{character.proficiency_bonus_label}</span>
              </div>
            )}
          </div>
          <TaperedRule />
        </div>
        {!_.isEmpty(character.special_abilities) && (
          <div className={classes.actionsContainer}>
            {character.special_abilities.map((specialAbility, index) => {
              return (
                <Typography key={index} variant="body2" className={classes.actionContainer}>
                  <span className={`${classes.actionName}`}>{specialAbility.name}</span>
                  <span className={classes.actionDescription}>{specialAbility.desc}</span>
                </Typography>
              )
            })}
          </div>
        )}
        {!_.isEmpty(character.actions) && (
          <div className={classes.actionsContainer}>
            <Typography variant="h2" className={`${classes.header} ${classes.actionsHeader}`}>
              Actions
            </Typography>
            <>
              {character.actions.map((action, index) => {
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
    </StatsContainer>
  )
}

export default CharacterCard
