import StatsContainer from 'components/StatsContainer'
import TaperedRule from 'components/TaperedRule'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { monsterState } from 'recoil/atoms'

import useStyles from './MonsterStats.styles'

const DescriptionBlock: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <p className={classes.blockDescription}>{children}</p>
}

const DescriptionInline: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return <p className={classes.inlineDescription}>{children}</p>
}

export const MonsterStats: React.FC = () => {
  const { classes } = useStyles()
  const currentMonster = useRecoilValue(monsterState)

  return (
    <div className={classes.root}>
      <StatsContainer className={classes.monsterContainer}>
        <h1 className={classes.name}>{currentMonster.name}</h1>
        <h2 className={classes.shortDescription}>{currentMonster.shortDescription}</h2>
        <TaperedRule />
        <div className={classes.baseStatsContainer}>
          <div>
            <span className={classes.statHeader}>Armor Class</span>
            <span className={classes.statValue}>{currentMonster.AC}</span>
          </div>
          <div>
            <span className={classes.statHeader}>Hit Points</span>
            <span className={classes.statValue}>{currentMonster.HP}</span>
          </div>
          <div>
            <span className={classes.statHeader}>Speed</span>
            <span className={classes.statValue}>{currentMonster.speed}</span>
          </div>
        </div>
        <TaperedRule />
        <div>
          <div className={classes.stats}>
            <div className={classes.statHeader}>STR</div>
            <div className={classes.statHeader}>DEX</div>
            <div className={classes.statHeader}>CON</div>
            <div className={classes.statHeader}>INT</div>
            <div className={classes.statHeader}>WIS</div>
            <div className={classes.statHeader}>CHA</div>
            <div className={classes.rowBreak} />
            <div className={classes.statValue}>
              <span>{currentMonster.STR}</span>
            </div>
            <div className={classes.statValue}>
              <span>{currentMonster.DEX}</span>
            </div>
            <div className={classes.statValue}>
              <span>{currentMonster.CON}</span>
            </div>
            <div className={classes.statValue}>
              <span>{currentMonster.INT}</span>
            </div>
            <div className={classes.statValue}>
              <span>{currentMonster.WIS}</span>
            </div>
            <div className={classes.statValue}>
              <span>{currentMonster.CHA}</span>
            </div>
          </div>
          <TaperedRule />
          <div className={classes.baseStatsContainer}>
            {currentMonster.skills && (
              <div>
                <span className={classes.statHeader}>Skills</span>
                <span className={classes.statValue}>{currentMonster.skills}</span>
              </div>
            )}
            {currentMonster.savingthrows && (
              <div>
                <span className={classes.statHeader}>Saving Throws</span>
                <span className={classes.statValue}>{currentMonster.savingthrows}</span>
              </div>
            )}
            {currentMonster.resistance && (
              <div>
                <span className={classes.statHeader}>Damage Resistance</span>
                <span className={classes.statValue}>{currentMonster.resistance}</span>
              </div>
            )}
            {currentMonster.damageimmunities && (
              <div>
                <span className={classes.statHeader}>Damage Immunities</span>
                <span className={classes.statValue}>{currentMonster.damageimmunities}</span>
              </div>
            )}
            {currentMonster.conditionimmunities && (
              <div>
                <span className={classes.statHeader}>Condition Immunities</span>
                <span className={classes.statValue}>{currentMonster.conditionimmunities}</span>
              </div>
            )}
            {currentMonster.senses && (
              <div>
                <span className={classes.statHeader}>Senses</span>
                <span className={classes.statValue}>{currentMonster.senses}</span>
              </div>
            )}
            {currentMonster.languages && (
              <div>
                <span className={classes.statHeader}>Languages</span>
                <span className={classes.statValue}>{currentMonster.languages}</span>
              </div>
            )}
            {currentMonster.challenge && (
              <div>
                <span className={classes.statHeader}>Challenge</span>
                <span className={classes.statValue}>{currentMonster.challenge}</span>
              </div>
            )}
          </div>
          <TaperedRule />
          <div>
            {currentMonster.features.map((feature, key) => {
              return (
                <div className={classes.actionRow} key={key}>
                  <h3 key={`header-${key}`} className={classes.actionName}>
                    {feature.name}
                  </h3>
                  <DescriptionInline>{feature.description}</DescriptionInline>
                </div>
              )
            })}
          </div>
          <div>
            <h3 className={classes.featureName}>ACTIONS</h3>
            {currentMonster.actions.map((action, key) => {
              return (
                <div className={classes.actionRow} key={key}>
                  <h3 key={`header-${key}`} className={classes.actionName}>
                    {action.name}
                  </h3>
                  <DescriptionInline>{action.description}</DescriptionInline>
                </div>
              )
            })}
          </div>
          {currentMonster.reactions.length > 0 && (
            <div>
              <h3 className={classes.featureName}>REACTIONS</h3>
              {currentMonster.reactions.map((reaction, key) => {
                return (
                  <div className={classes.actionRow} key={key}>
                    <h3 key={`header-${key}`} className={classes.actionName}>
                      {reaction.name}
                    </h3>
                    <DescriptionInline>{reaction.description}</DescriptionInline>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </StatsContainer>
      <div className={classes.imageContainer}>
        <img alt={currentMonster.image.props.alt} src={`${currentMonster.image.props.src}`} />
        {currentMonster.mainDescription && (
          <div className={classes.mainDescription}>
            {currentMonster.mainDescription.split('\n').map((value, key) => {
              return <DescriptionBlock key={`description-${key}`}>{value}</DescriptionBlock>
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MonsterStats
