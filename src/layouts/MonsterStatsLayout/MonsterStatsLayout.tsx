import { Grid } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MonsterStats from 'components/MonsterStats'
import MonsterStatsInput from 'components/MonsterStatsInput'
import React from 'react'

const MonsterStatsLayout: React.FC = () => {
  const isPrint = useMediaQuery("print")
  const isSmall = useMediaQuery("(max-width:960px)")
  return (
    <Grid container={true} spacing={isPrint ? 0 : isSmall ? 4 : 10}>
      <Grid item={true} xs={12}>
        <MonsterStats />
      </Grid>
      {!isPrint && (
        <Grid item={true} xs={12}>
          <MonsterStatsInput />
        </Grid>
      )}
    </Grid>
  )
}

export default MonsterStatsLayout
