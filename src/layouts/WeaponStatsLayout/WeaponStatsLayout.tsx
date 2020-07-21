import { Grid } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import WeaponStats from 'components/WeaponStats'
import WeaponStatsInput from 'components/WeaponStatsInput'
import React from 'react'

const WeaponStatsLayout: React.FC = () => {
  const isPrint = useMediaQuery("print")
  const isSmall = useMediaQuery("(max-width:600px)")
  return (
    <Grid container={true} spacing={isSmall ? 4 : 10}>
      {!isPrint && (
        <Grid item={true} xs={12} md={6}>
          <WeaponStatsInput />
        </Grid>
      )}
      <Grid item={true} xs={12} md={isPrint ? 12 : 6}>
        <WeaponStats />
      </Grid>
    </Grid>
  )
}

export default WeaponStatsLayout
