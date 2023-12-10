import MonsterStats from 'components/MonsterStats'
import StatsLayout from 'layouts/StatsLayout'
import React from 'react'

const MonsterStatsLayout: React.FC = () => {
  return <StatsLayout statsComponent={<MonsterStats />} inputComponent={null} />
}

export default MonsterStatsLayout
