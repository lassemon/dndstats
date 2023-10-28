import { Box, Grid, GridSize } from '@mui/material'
import React from 'react'

interface StatsLayoutProps {
  statsComponent?: React.ReactNode
  inputComponent: React.ReactNode
  widthPoint?: GridSize
  sx?: any
}

const StatsLayout: React.FC<StatsLayoutProps> = (props) => {
  const { statsComponent, inputComponent, sx } = props
  return (
    <Grid
      container={true}
      columnSpacing={0}
      rowSpacing={2}
      style={{
        margin: 0,
        width: '100%'
      }}
      sx={sx ? sx : {}}
    >
      {statsComponent && (
        <Grid
          item={true}
          xs={12}
          md={12}
          sx={{
            margin: '0 1em'
          }}
        >
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
