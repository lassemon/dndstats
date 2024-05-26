import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import statblockparch from 'assets/statblockparch.jpg'
import statblockparchwhite from 'assets/statblockparch_white.jpg'
import ToggleButton from 'components/ToggleButton'
import MinusButton from 'components/MinusButton'
import PlusButton from 'components/PlusButton'
import { makeStyles } from 'tss-react/mui'
import classNames from 'classnames/bind'
import { useOrientation } from 'utils/hooks'
import { resizeObserver } from 'utils/rootResize'

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
    height: 'min-content',
    margin: '0 auto',
    '@media print': {
      '&&': {
        width: '98%'
      }
    }
  },
  smallContainer: {
    width: '95%'
  },
  mediumContainer: {
    width: '90%'
  },
  largeContainer: {
    width: '90%'
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
  const resizeTriggerElementRef = useRef(null)

  const { classes } = useStyles()
  const cx = classNames.bind(classes)

  useEffect(() => {
    if (resizeTriggerElementRef.current) {
      resizeObserver.observe(resizeTriggerElementRef.current)
    }
  }, [])

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

      const textContainer = element.getElementsByClassName('itemCard-textContainer')
      const textElement = textContainer.item(i) as HTMLElement
      if (textElement) {
        const flexBasis = parseFloat(window.getComputedStyle(textElement, null).getPropertyValue('flex-basis').replace('%', ''))
        textElement.style.flexBasis = `${flexBasis - 2}%`
      }
    }
  }

  const onFontSizeSmaller = () => {
    const statsContainers = document.getElementsByClassName('stats-container')
    for (var i = 0; i < statsContainers.length; i++) {
      const element = statsContainers.item(i) as HTMLElement
      const fontSize = parseFloat(window.getComputedStyle(element, null).getPropertyValue('font-size'))
      element.style.fontSize = `${fontSize - 1}px`

      const textContainer = element.getElementsByClassName('itemCard-textContainer')
      const textElement = textContainer.item(i) as HTMLElement
      if (textElement) {
        const flexBasis = parseFloat(window.getComputedStyle(textElement, null).getPropertyValue('flex-basis').replace('%', ''))
        textElement.style.flexBasis = `${flexBasis + 2}%`
      }
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
      className="stats-layout"
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
          ref={resizeTriggerElementRef}
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
            maxWidth: isLarge && !alwaysPortrait ? '35%' : '100%',
            minHeight: '100%',
            maxHeight: isLarge && !alwaysPortrait ? '100dvh' : 'inherit',
            overflowY: isLarge && !alwaysPortrait ? 'scroll' : 'auto',
            scrollbarWidth: 'thin'
          }
        }}
      >
        {inputComponent}
      </Box>
    </Box>
  )
}

export default StatsLayout
