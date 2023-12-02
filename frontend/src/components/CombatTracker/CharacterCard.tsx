import StatsContainer from 'components/StatsContainer'
import React from 'react'

import useStyles from './CharacterCard.styles'
import TaperedRule from 'components/TaperedRule'
import _ from 'lodash'
import { printConditions } from './Conditions'
import Character from 'domain/entities/Character'

interface CharacterCardProps {
  character: Character
}

const CharacterCard: React.FC<CharacterCardProps> = (props) => {
  const { character } = props

  const { classes } = useStyles()

  return (
    <StatsContainer size="small" className={`${classes.root}`}>
      <h1 className={classes.name}>{character.name}</h1>
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
      <div>
        <TaperedRule />
        {!_.isEmpty(character.conditions) && (
          <div>
            <span className={`${classes.statHeader}`}>Conditions</span>
            <span className={classes.statValue}>{printConditions(character.conditions).join(', ')}</span>
          </div>
        )}
        {!_.isEmpty(character.resistances) && (
          <div>
            <span className={`${classes.statHeader}`}>Damage Resistances</span>
            <span className={classes.statValue}>{character.resistances.join(', ')}</span>
          </div>
        )}
        {!_.isEmpty(character.vulnerabilities) && (
          <div>
            <span className={`${classes.statHeader}`}>Damage Vulnerabilities</span>
            <span className={classes.statValue}>{character.vulnerabilities.join(', ')}</span>
          </div>
        )}
        {!_.isEmpty(character.damage_immunities) && (
          <div>
            <span className={`${classes.statHeader}`}>Damage Immunities</span>
            <span className={classes.statValue}>{character.damage_immunities.join(', ')}</span>
          </div>
        )}
      </div>
    </StatsContainer>
  )
}

export default CharacterCard
