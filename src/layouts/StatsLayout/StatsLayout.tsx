import { Box, Grid, GridSize } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import React from 'react'

interface StatsLayoutProps {
  statsComponent?: React.ReactNode
  inputComponent: React.ReactNode
  widthPoint?: GridSize
}

const StatsLayout: React.FC<StatsLayoutProps> = (props) => {
  const { statsComponent, inputComponent, widthPoint = 12 } = props
  const isPrint = useMediaQuery('print')
  const isSmall = useMediaQuery('(max-width:960px)')
  return (
    <Grid
      container={true}
      spacing={4}
      justifyContent="center"
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
  );
}

export default StatsLayout
