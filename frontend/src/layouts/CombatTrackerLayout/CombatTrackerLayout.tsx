import CombatTracker from 'components/CombatTracker'
import StatsLayout from 'layouts/StatsLayout'
import React from 'react'

const MonsterStatsLayout: React.FC = () => {
  return (
    <StatsLayout
      inputComponent={<CombatTracker />}
    />
  )
}

export default MonsterStatsLayout
