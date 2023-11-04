import { Box, Grid } from '@mui/material'
import CombatTracker from 'components/CombatTracker'
import React from 'react'

const MonsterStatsLayout: React.FC = () => {
  return (
    <Grid
      container={true}
      columnSpacing={0}
      rowSpacing={2}
      style={{
        margin: 0,
        width: '100%'
      }}
      sx={{ '& > .MuiGrid-item': { paddingTop: '0' } }}
    >
      <Grid item={true} xs={12}>
        <Box display="block" displayPrint="none">
          <CombatTracker />
        </Box>
      </Grid>
    </Grid>
  )
}

export default MonsterStatsLayout
