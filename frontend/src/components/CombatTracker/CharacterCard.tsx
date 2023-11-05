import StatsContainer from 'components/StatsContainer'
import { Character } from 'interfaces'
import React from 'react'

import useStyles from './CharacterCard.styles'
import TaperedRule from 'components/TaperedRule'
import _ from 'lodash'
import { printConditions } from './Conditions'

interface CharacterCardProps {
  character: Character
}

const CharacterCard: React.FC<CharacterCardProps> = (props) => {
  const { character } = props

  const { classes } = useStyles()

  return (
    <StatsContainer size="small" className={`${classes.statsContainer}`}>
      <h1 className={classes.name}>{character.name}</h1>
      <TaperedRule />
      <div className={classes.baseStatsContainer}>
        <div>
          <span className={classes.statHeader}>Armor Class</span>
          <span className={classes.statValue}>{character.AC}</span>
        </div>
        <div>
          <span className={classes.statHeader}>Hit Points</span>
          <span className={classes.statValue}>
            {character.current_hit_points + (character.temporary_hit_points || 0)} / {character.hp_cap}
          </span>
        </div>
        {/*
          <div>
            <span className={classes.statHeader}>Speed</span>
            <span className={classes.statValue}>{character.speed}</span>
          </div>
            */}
        <TaperedRule />
        {!_.isEmpty(character.conditions) && (
          <div>
            <span className={`${classes.statHeader} ${classes.statHeaderNewLine}`}>Conditions</span>
            <span className={classes.statValue}>{printConditions(character.conditions).join(', ')}</span>
          </div>
        )}
        {!_.isEmpty(character.resistances) && (
          <div>
            <span className={`${classes.statHeader} ${classes.statHeaderNewLine}`}>Damage Resistances</span>
            <span className={classes.statValue}>{character.resistances.join(', ')}</span>
          </div>
        )}
        {!_.isEmpty(character.vulnerabilities) && (
          <div>
            <span className={`${classes.statHeader} ${classes.statHeaderNewLine}`}>Damage Vulnerabilities</span>
            <span className={classes.statValue}>{character.vulnerabilities.join(', ')}</span>
          </div>
        )}
        {!_.isEmpty(character.immunities) && (
          <div>
            <span className={`${classes.statHeader} ${classes.statHeaderNewLine}`}>Damage Immunities</span>
            <span className={classes.statValue}>{character.immunities.join(', ')}</span>
          </div>
        )}
      </div>
    </StatsContainer>
  )
}

export default CharacterCard
