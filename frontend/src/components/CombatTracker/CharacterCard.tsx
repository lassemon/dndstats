import StatsContainer from 'components/StatsContainer'
import React from 'react'

import useStyles from './CharacterCard.styles'
import TaperedRule from 'components/TaperedRule'
import _ from 'lodash'
import { printConditions } from './Conditions'
import Character from 'domain/entities/Character'
import { Typography } from '@mui/material'

interface CharacterCardProps {
  character: Character
}

const CharacterCard: React.FC<CharacterCardProps> = (props) => {
  const { character } = props

  const { classes } = useStyles()

  return (
    <StatsContainer size="small" className={`${classes.root}`}>
      <div className={`${!_.isEmpty(character.actions) ? classes.rootFlex : ''}`}>
        <div className={classes.statsColumnLeft}>
          <Typography variant="h1" className={`${classes.header} ${classes.name}`}>
            {character.name}
          </Typography>
          <TaperedRule />
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
                <span className={classes.statValue}>
                  {Object.entries(character.speed)
                    .map(([key, value]) => `${key !== 'walk' ? key : ''} ${value}`)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
          {character.hasAbilityScores() && (
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
          )}
          <div className={classes.statsContainer}>
            <TaperedRule />
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
                <span className={classes.statValue}>{printConditions(character.conditions).join(', ')}</span>
              </div>
            )}
            {!_.isEmpty(character.damage_resistances) && (
              <div>
                <span className={`${classes.statHeader}`}>Damage Resistances</span>
                <span className={classes.statValue}>{character.damage_resistances.join(', ')}</span>
              </div>
            )}
            {!_.isEmpty(character.damage_vulnerabilities) && (
              <div>
                <span className={`${classes.statHeader}`}>Damage Vulnerabilities</span>
                <span className={classes.statValue}>{character.damage_vulnerabilities.join(', ')}</span>
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
          </div>
        </div>
        {!_.isEmpty(character.actions) && (
          <div className={classes.statsColumnRight}>
            <Typography variant="h2" className={`${classes.header} ${classes.actionsHeader}`}>
              Actions
            </Typography>
            <>
              {character.actions.map((action, index) => {
                return (
                  <Typography key={index} variant="body2" className={classes.actionContainer}>
                    <span className={classes.actionName}>{action.name}</span>
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
