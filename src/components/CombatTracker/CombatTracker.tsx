import { Grid, InputAdornment, TextField } from '@mui/material'
import StatsInputContainer from 'components/StatsInputContainer'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { combatTrackerState } from 'recoil/atoms'

import useStyles from './CombatTracker.styles'

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const CombatTracker: React.FC = () => {
  const classes = useStyles()
  const currentCombat = useRecoilValue(combatTrackerState)
  const setCurrentCombat = useSetRecoilState(combatTrackerState)

  const onChangeEnemyInit = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const enemyCopy = replaceItemAtIndex(combat.enemies, index, {
        init: event.target.value
      })
      return {
        ...combat,
        enemies: enemyCopy
      }
    })
  }

  const onChangeEnemyName = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const enemyCopy = replaceItemAtIndex(combat.enemies, index, {
        name: event.target.value
      })
      return {
        ...combat,
        enemies: enemyCopy
      }
    })
  }

  const onChangeEnemyHP = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const enemyCopy = replaceItemAtIndex(combat.enemies, index, {
        name: event.target.value
      })
      return {
        ...combat,
        enemies: enemyCopy
      }
    })
  }

  return (
    <StatsInputContainer>
      {currentCombat.enemies.map((enemy, key) => {
        return (
          <Grid container={true} spacing={2} justifyContent="space-around">
            <Grid item={true} xs={12} sm={4}>
              <TextField
                id="enemy-init"
                value={enemy.init}
                onChange={onChangeEnemyInit(key)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">init</InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item={true} xs={12} sm={4}>
              <TextField
                id="enemy-name"
                value={enemy.name}
                onChange={onChangeEnemyName(key)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">name</InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item={true} xs={12} sm={4}>
              <TextField
                id="enemy-hit-points"
                value={enemy.orig_hit_points}
                onChange={onChangeEnemyHP(key)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">HP</InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        )
      })}
    </StatsInputContainer>
  )
}

export default CombatTracker
