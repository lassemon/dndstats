import ItemStats from 'components/ItemStats'
import ItemStatsInput from 'components/ItemStatsInput'
import StatsLayout from 'layouts/StatsLayout'
import React from 'react'

const ItemStatsLayout: React.FC = () => {
  return (
    <StatsLayout
      statsComponent={<ItemStats />}
      inputComponent={<ItemStatsInput />}
      widthPoint={6}
    />
  )
}

export default ItemStatsLayout
