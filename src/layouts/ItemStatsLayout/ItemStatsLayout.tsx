import { Grid } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ItemStats from 'components/ItemStats'
import ItemStatsInput from 'components/ItemStatsInput'
import React from 'react'

const ItemStatsLayout: React.FC = () => {
  const isPrint = useMediaQuery("print")
  return (
    <Grid container={true} spacing={10} justify="center">
      <Grid item={true} xs={isPrint ? 12 : 6}>
        <ItemStats />
      </Grid>
      {!isPrint && (
        <Grid item={true} xs={12}>
          <ItemStatsInput />
        </Grid>
      )}
    </Grid>
  )
}

export default ItemStatsLayout
