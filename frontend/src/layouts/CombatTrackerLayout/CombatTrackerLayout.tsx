import CombatTracker from 'components/CombatTracker'
import StatsLayout from 'layouts/StatsLayout'
import React from 'react'

const MonsterStatsLayout: React.FC = () => {
  return <StatsLayout sx={{ '& > .MuiGrid-item': { paddingTop: '0' } }} inputComponent={<CombatTracker />} />
}

export default MonsterStatsLayout
