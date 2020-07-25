import { Grid } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import SpellStats from 'components/SpellStats'
import SpellStatsInput from 'components/SpellStatsInput'
import React from 'react'

const SpellStatsLayout: React.FC = () => {
  const isPrint = useMediaQuery("print")
  const isSmall = useMediaQuery("(max-width:960px)")
  return (
    <Grid container={true} spacing={isSmall ? 4 : 10} justify="center">
      <Grid item={true} xs={12} md={isPrint ? 12 : 5}>
        <SpellStats />
      </Grid>
      {!isPrint && (
        <Grid item={true} xs={12}>
          <SpellStatsInput />
        </Grid>
      )}
    </Grid>
  )
}

export default SpellStatsLayout
