import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import statblockparch from 'assets/statblockparch.jpg'
import statblockparchwhite from 'assets/statblockparch_white.jpg'
import ToggleButton from 'components/ToggleButton'
import MinusButton from 'components/MinusButton'
import PlusButton from 'components/PlusButton'
import { makeStyles } from 'tss-react/mui'
import classNames from 'classnames/bind'
import { useOrientation } from 'utils/hooks'

interface StatsLayoutProps {
  statsComponent?: React.ReactNode
  inputComponent: React.ReactNode
  screenshotMode?: boolean
  sx?: any
  alwaysPortrait?: boolean
  defaultWidth?: string
  smallWidth?: string
  mediumWidth?: string
  largeWidth?: string
  printWidth?: string
}

export const useStyles = makeStyles()((theme) => ({
  container: {
    width: '60%',
    margin: '0 auto',
    '@media print': {
      '&&': {
        width: '90%'
      }
    }
  },
  smallContainer: {
    width: '95%'
  },
  mediumContainer: {
    width: '80%'
  },
  largeContainer: {
    width: '70%'
  }
}))

const StatsLayout: React.FC<StatsLayoutProps> = (props) => {
  const {
    statsComponent,
    inputComponent,
    screenshotMode,
    alwaysPortrait,
    defaultWidth,
    smallWidth,
    mediumWidth,
    largeWidth,
    printWidth,
    sx = {}
  } = props

  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('xl'))
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

  const { classes } = useStyles()
  const cx = classNames.bind(classes)

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

  const widthStyles = {
    ...(defaultWidth ? { width: defaultWidth } : {}),
    ...(smallWidth ? { width: smallWidth } : {}),
    ...(mediumWidth ? { width: mediumWidth } : {}),
    ...(largeWidth ? { width: largeWidth } : {}),
    ...(printWidth ? { width: printWidth } : {})
  }

  return (
    <Box
      sx={{
        ...sx,
        ...{
          margin: 0,
          height: '100%',
          display: 'flex',
          flexDirection: isLarge && !alwaysPortrait ? 'row-reverse' : 'column'
        }
      }}
    >
      {statsComponent && (
        <Box
          className={cx({
            [classes.container]: true,
            [classes.smallContainer]: isPortrait,
            [classes.mediumContainer]: !isPortrait,
            [classes.largeContainer]: isLarge
          })}
          sx={{
            ...{
              '&&': {
                ...widthStyles,
                ...{
                  padding: `1em`,
                  paddingTop: '0.5em'
                }
              }
            }
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              '&&': {
                minHeight: 'auto',
                padding: '0.5em 0'
              },
              '& button': {
                padding: 0
              }
            }}
          >
            <Box displayPrint="none" sx={{ visibility: screenshotMode ? 'hidden' : 'visible' }}>
              <ToggleButton onClick={onToggleBg} />
              <PlusButton onClick={onFontSizeLarger} />
              <MinusButton onClick={onFontSizeSmaller} />
            </Box>
          </Toolbar>
          {statsComponent}
        </Box>
      )}
      <Box
        displayPrint="none"
        sx={{
          '&&&': {
            padding: 0,
            paddingTop: 0,
            maxWidth: isLarge && !alwaysPortrait ? '45%' : '100%'
          }
        }}
      >
        {inputComponent}
      </Box>
    </Box>
  )
}

export default StatsLayout
