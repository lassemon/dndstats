import WeaponStats from 'components/WeaponStats'
import WeaponStatsInput from 'components/WeaponStatsInput'
import StatsLayout from 'layouts/StatsLayout'
import React from 'react'

const WeaponStatsLayout: React.FC = () => {
  return <StatsLayout statsComponent={<WeaponStats />} inputComponent={<WeaponStatsInput />} />
}

export default WeaponStatsLayout
