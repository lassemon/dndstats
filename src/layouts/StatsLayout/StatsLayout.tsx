import { Box, Grid, GridSize } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import React from 'react'

interface StatsLayoutProps {
  statsComponent: React.ReactNode
  inputComponent: React.ReactNode
  widthPoint?: GridSize
}

const StatsLayout: React.FC<StatsLayoutProps> = (props) => {
  const { statsComponent, inputComponent, widthPoint = 12 } = props
  const isPrint = useMediaQuery("print")
  const isSmall = useMediaQuery("(max-width:960px)")
  return (
    <Grid
      container={true}
      spacing={isSmall ? 4 : 6}
      justify="center"
      style={{
        margin: 0,
        width: "100%",
      }}
    >
      <Grid item={true} xs={12} md={isPrint ? 12 : widthPoint}>
        {statsComponent}
      </Grid>
      <Grid item={true} xs={12}>
        <Box display="block" displayPrint="none">
          {inputComponent}
        </Box>
      </Grid>
    </Grid>
  )
}

export default StatsLayout
