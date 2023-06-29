import {
  Button,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core'
import { Container, Draggable } from 'react-smooth-dnd'
import List from '@material-ui/core/List'
import { arrayMoveImmutable as arrayMove } from 'array-move'
import ListItem from '@material-ui/core/ListItem'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Status, combatTrackerState } from 'recoil/atoms'
import _ from 'lodash'
import classNames from 'classnames/bind'

import useStyles from './CombatTracker.styles'
import DeleteButton from 'components/DeleteButton'
import AddEnemyInput, { Enemy } from './AddEnemyInput'

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

const parseStatus = (enemy: any) => {
  let conditions = [...enemy.conditions]
  conditions = isBloodied(enemy)
    ? setStatus(conditions, Status.Bloodied)
    : removeStatus(conditions, Status.Bloodied)

  conditions = isDead(enemy)
    ? setStatus(conditions, Status.Dead)
    : removeStatus(conditions, Status.Dead)

  return conditions
}

const isDead = (enemy: any) => {
  return enemy.current_hit_points <= 0
}

const isBloodied = (enemy: any) => {
  return enemy.current_hit_points < enemy.orig_hit_points / 2
}

const setStatus = (statuses: any, status: Status) => {
  if (status === Status.Dead) {
    return [Status.Dead]
  }
  if (!statuses.includes(status)) {
    return statuses.concat(status)
  } else {
    return statuses
  }
}

const removeStatus = (statuses: any, status: Status) => {
  return _.filter(statuses, (_status) => {
    return _status !== status
  })
}

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: theme.palette.primary.dark
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.status.blood
  }
}))(LinearProgress)

export const CombatTracker: React.FC = () => {
  const classes = useStyles()
  const cx = classNames.bind(classes)
  const currentCombat = useRecoilValue(combatTrackerState)
  const setCurrentCombat = useSetRecoilState(combatTrackerState)

  const onSort = () => {
    setCurrentCombat((combat) => {
      const sortedEnemies = _.orderBy(
        [...combat.enemies],
        [
          (enemy: any) => {
            return enemy.init
          }
        ],
        'desc'
      )
      return {
        ...combat,
        enemies: sortedEnemies
      }
    })
  }

  const onChangeEnemyInit = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const enemiesCopy = replaceItemAtIndex(combat.enemies, index, {
        ...combat.enemies[index],
        init: parseInt(event.target.value) || 0
      })
      return {
        ...combat,
        enemies: enemiesCopy
      }
    })
  }

  const onChangeEnemyName = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const enemiesCopy = replaceItemAtIndex(combat.enemies, index, {
        ...combat.enemies[index],
        name: event.target.value
      })
      return {
        ...combat,
        enemies: enemiesCopy
      }
    })
  }

  const onStoreEnemyDamage = (index: number) => (event: any) => {
    setCurrentCombat((combat) => {
      const enemiesCopy = replaceItemAtIndex(combat.enemies, index, {
        ...combat.enemies[index],
        damage: event.target.value
      })
      return {
        ...combat,
        enemies: enemiesCopy
      }
    })
  }

  const onDrop = ({
    removedIndex,
    addedIndex
  }: {
    removedIndex: any
    addedIndex: any
  }) => {
    setCurrentCombat((combat) => {
      return {
        ...combat,
        enemies: arrayMove(combat.enemies, removedIndex, addedIndex)
      }
    })
  }

  const onAddEnemy = (enemy: Enemy) => {
    setCurrentCombat((combat) => {
      const enemiesCopy = [...combat.enemies]

      const index = _.findIndex(enemiesCopy, (_enemy) => {
        return _enemy.init < enemy.init
      })
      const indexToInsert = index >= 0 ? index : enemiesCopy.length
      enemiesCopy.splice(indexToInsert, 0, {
        init: enemy.init,
        name: enemy.name,
        orig_hit_points: enemy.hp,
        current_hit_points: enemy.hp,
        damage: '',
        conditions: []
      })
      return {
        ...combat,
        enemies: enemiesCopy
      }
    })
  }

  const onDeleteEnemy = (index: number) => () => {
    setCurrentCombat((combat) => {
      const enemiesCopy = [...combat.enemies]
      enemiesCopy.splice(index, 1)
      return {
        ...combat,
        enemies: enemiesCopy
      }
    })
  }

  const onDamageEnemy = (index: number) => (event: any) => {
    if (event.keyCode === 13) {
      setCurrentCombat((combat) => {
        const enemy = combat.enemies[index]
        const HPafterDamage = enemy.current_hit_points + parseInt(enemy.damage)
        const HPinBound =
          HPafterDamage >= 0
            ? HPafterDamage > enemy.orig_hit_points
              ? enemy.orig_hit_points
              : HPafterDamage
            : 0

        const enemiesCopy = replaceItemAtIndex(combat.enemies, index, {
          ...enemy,
          conditions: parseStatus({
            ...enemy,
            current_hit_points: HPinBound
          }),
          current_hit_points: HPinBound,
          damage: '' // reset stored damage
        })
        return {
          ...combat,
          enemies: enemiesCopy
        }
      })
    }
  }

  return (
    <div className={`${classes.root}`}>
      <Button variant="contained" color="primary" onClick={onSort}>
        Sort by init
      </Button>
      <List>
        <Container
          dragHandleSelector=".drag-handle"
          lockAxis="y"
          onDrop={onDrop}
        >
          {currentCombat.enemies.map((enemy, key) => {
            return (
              <Draggable key={key}>
                <ListItem
                  dense
                  disableGutters
                  disabled={enemy.conditions.includes(Status.Dead)}
                  className={cx({
                    [classes.listItem]: true,
                    [classes.listItemBloodied]: enemy.conditions.includes(
                      Status.Bloodied
                    ),
                    [classes.listItemDead]: enemy.conditions.includes(
                      Status.Dead
                    )
                  })}
                >
                  <ListItemIcon className={`${classes.deleteIconContainer}`}>
                    <DeleteButton onClick={onDeleteEnemy(key)} />
                  </ListItemIcon>
                  <TextField
                    id="enemy-init"
                    className={`${classes.textField} ${classes.initField}`}
                    value={enemy.init}
                    disabled={enemy.conditions.includes(Status.Dead)}
                    onChange={onChangeEnemyInit(key)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">init</InputAdornment>
                      )
                    }}
                    variant="outlined"
                  />
                  <TextField
                    id="enemy-name"
                    className={`${classes.textField} ${classes.nameField}`}
                    value={enemy.name}
                    disabled={enemy.conditions.includes(Status.Dead)}
                    onChange={onChangeEnemyName(key)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">name</InputAdornment>
                      )
                    }}
                    variant="outlined"
                  />
                  <Typography className={classes.hpText}>
                    HP {enemy.current_hit_points}
                  </Typography>
                  <div className={classes.hpBarContainer}>
                    <BorderLinearProgress
                      className={classes.hpBar}
                      variant="determinate"
                      value={Math.round(
                        (enemy.current_hit_points / enemy.orig_hit_points) * 100
                      )}
                    />
                  </div>
                  <TextField
                    id="enemy-hit-points"
                    className={`${classes.textField} ${classes.hpField}`}
                    value={enemy.damage}
                    onChange={onStoreEnemyDamage(key)}
                    onKeyDown={onDamageEnemy(key)}
                    variant="outlined"
                  />
                  <Typography>{enemy.conditions.join(', ')}</Typography>
                  <ListItemIcon
                    className={`${
                      enemy.conditions.includes(Status.Dead)
                        ? ''
                        : 'drag-handle'
                    } ${classes.dragIconContainer}`}
                  >
                    <DragHandleIcon />
                  </ListItemIcon>
                </ListItem>
              </Draggable>
            )
          })}
        </Container>
      </List>
      <AddEnemyInput onAddEnemy={onAddEnemy} />
    </div>
  )
}

export default CombatTracker
