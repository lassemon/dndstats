import { Box, Grid, GridSize } from '@mui/material'
import React from 'react'

interface StatsLayoutProps {
  statsComponent?: React.ReactNode
  inputComponent: React.ReactNode
  widthPoint?: GridSize
}

const StatsLayout: React.FC<StatsLayoutProps> = (props) => {
  const { statsComponent, inputComponent } = props
  return (
    <Grid
      container={true}
      spacing={4}
      //justify="center"
      style={{
        margin: 0,
        width: '100%'
      }}
    >
      {statsComponent && (
        <Grid item={true} xs={12} md={12}>
          {statsComponent}
        </Grid>
      )}
      <Grid item={true} xs={12}>
        <Box display="block" displayPrint="none">
          {inputComponent}
        </Box>
      </Grid>
    </Grid>
  )
}

export default StatsLayout
