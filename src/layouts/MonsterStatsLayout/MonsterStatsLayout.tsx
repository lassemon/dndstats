import MonsterStats from 'components/MonsterStats'
import MonsterStatsInput from 'components/MonsterStatsInput'
import StatsLayout from 'layouts/StatsLayout'
import React from 'react'

const MonsterStatsLayout: React.FC = () => {
  return (
    <StatsLayout
      statsComponent={<MonsterStats />}
      inputComponent={<MonsterStatsInput />}
    />
  )
}

export default MonsterStatsLayout
