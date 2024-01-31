import { Box, Grid, GridSize, Toolbar } from '@mui/material'
import React from 'react'
import statblockparch from 'assets/statblockparch.jpg'
import statblockparchwhite from 'assets/statblockparch_white.jpg'
import ToggleButton from 'components/ToggleButton'
import MinusButton from 'components/MinusButton'
import PlusButton from 'components/PlusButton'

interface StatsLayoutProps {
  statsComponent?: React.ReactNode
  inputComponent: React.ReactNode
  sx?: any
}

const StatsLayout: React.FC<StatsLayoutProps> = (props) => {
  const { statsComponent, inputComponent, sx } = props

  const onToggleBg = () => {
    const statsContainers = document.getElementsByClassName('stats-background')
    for (var i = 0; i < statsContainers.length; i++) {
      const element = statsContainers.item(i) as HTMLElement
      if (element.style.backgroundImage.includes('white')) {
        element.style.backgroundImage = 'url(' + statblockparch + ')'
      } else {
        element.style.backgroundImage = 'url(' + statblockparchwhite + ')'
      }
    }
  }

  const onFontSizeLarger = () => {
    const statsContainers = document.getElementsByClassName('stats-container')
    for (var i = 0; i < statsContainers.length; i++) {
      const element = statsContainers.item(i) as HTMLElement
      const fontSize = parseFloat(window.getComputedStyle(element, null).getPropertyValue('font-size'))
      element.style.fontSize = `${fontSize + 1}px`
    }
  }

  const onFontSizeSmaller = () => {
    const statsContainers = document.getElementsByClassName('stats-container')
    for (var i = 0; i < statsContainers.length; i++) {
      const element = statsContainers.item(i) as HTMLElement
      const fontSize = parseFloat(window.getComputedStyle(element, null).getPropertyValue('font-size'))
      element.style.fontSize = `${fontSize - 1}px`
    }
  }

  return (
    <Grid
      container={true}
      columnSpacing={0}
      rowSpacing={2}
      style={{
        margin: 0,
        height: '100%'
      }}
      sx={sx ? sx : {}}
    >
      {statsComponent && (
        <Grid
          item={true}
          xs={12}
          md={12}
          sx={{
            '&&': {
              margin: `0 1em`,
              paddingTop: 0
            }
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              '&&': {
                minHeight: 'auto',
                padding: '0.5em 0',
                width: '95%'
              },
              '& button': {
                padding: 0
              }
            }}
          >
            <Box displayPrint="none">
              <ToggleButton onClick={onToggleBg} />
              <PlusButton onClick={onFontSizeLarger} />
              <MinusButton onClick={onFontSizeSmaller} />
            </Box>
          </Toolbar>
          {statsComponent}
        </Grid>
      )}
      <Grid item={true} xs={12}>
        {inputComponent}
      </Grid>
    </Grid>
  )
}

export default StatsLayout
