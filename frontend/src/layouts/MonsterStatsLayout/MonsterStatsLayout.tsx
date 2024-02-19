import MonsterStats from 'components/MonsterStats'
import MonsterStatsInput from 'components/MonsterStatsInput'
import StatsLayout from 'layouts/StatsLayout'
import React from 'react'

const MonsterStatsLayout: React.FC = () => {
  return (
    <StatsLayout
      statsComponent={<MonsterStats />}
      inputComponent={<MonsterStatsInput />}
      sx={{
        '&': {
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%'
        },
        '& > div': {
          flexBasis: '100%',
          maxWidth: '100%'
        }
      }}
    />
  )
}

export default MonsterStatsLayout
