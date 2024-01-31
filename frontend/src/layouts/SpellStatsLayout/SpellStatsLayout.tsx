import SpellStats from 'components/SpellStats'
import SpellStatsInput from 'components/SpellStatsInput'
import StatsLayout from 'layouts/StatsLayout'
import React from 'react'

const SpellStatsLayout: React.FC = () => {
  return <StatsLayout statsComponent={<SpellStats />} inputComponent={<SpellStatsInput />} />
}

export default SpellStatsLayout
