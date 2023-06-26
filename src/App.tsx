import {
  AppBar,
  Box,
  Button,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import statblockparch from 'assets/statblockparch.jpg'
import statblockparchwhite from 'assets/statblockparch_white.jpg'
import MinusButton from 'components/MinusButton'
import PlusButton from 'components/PlusButton'
import TabPanel from 'components/TabPanel'
import ToggleButton from 'components/ToggleButton'
import AboutLayout from 'layouts/AboutLayout'
import CombatTrackerLayout from 'layouts/CombatTrackerLayout'
import ItemStatsLayout from 'layouts/ItemStatsLayout'
import MonsterStatsLayout from 'layouts/MonsterStatsLayout'
import SpellStatsLayout from 'layouts/SpellStatsLayout'
import WeaponStatsLayout from 'layouts/WeaponStatsLayout'
import React, { useState } from 'react'
import { RecoilRoot } from 'recoil'
import theme from 'theme'

import useStyles from './App.styles'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const App: React.FC = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const [bgValue, setBgValue] = useState('normal')

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue)
  }

  const onPrint = (event: any) => {
    window.print()
  }

  const onFontSizeLarger = (event: any) => {
    const statsContainers = document.getElementsByClassName('stats-container')
    for (var i = 0; i < statsContainers.length; i++) {
      const element = statsContainers.item(i) as HTMLElement
      const fontSize = parseFloat(
        window.getComputedStyle(element, null).getPropertyValue('font-size')
      )
      element.style.fontSize = `${fontSize + 1}px`
    }
  }

  const onFontSizeSmaller = (event: any) => {
    const statsContainers = document.getElementsByClassName('stats-container')
    for (var i = 0; i < statsContainers.length; i++) {
      const element = statsContainers.item(i) as HTMLElement
      const fontSize = parseFloat(
        window.getComputedStyle(element, null).getPropertyValue('font-size')
      )
      element.style.fontSize = `${fontSize - 1}px`
    }
  }

  const onToggleBg = (event: any) => {
    const statsContainers = document.getElementsByClassName('stats-background')
    if (bgValue === 'normal') {
      setBgValue('white')
    } else {
      setBgValue('normal')
    }
    for (var i = 0; i < statsContainers.length; i++) {
      const element = statsContainers.item(i) as HTMLElement
      if (bgValue === 'white') {
        element.style.backgroundImage = 'url(' + statblockparch + ')'
      } else {
        element.style.backgroundImage = 'url(' + statblockparchwhite + ')'
      }
    }
  }

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Box display="block" displayPrint="none">
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              <Tabs
                className={classes.tabs}
                value={value}
                onChange={handleChange}
                aria-label="dnd stats tabs"
                variant="scrollable"
                scrollButtons="on"
              >
                <Tab label="Item Stats" {...a11yProps(0)} />
                <Tab label="Spell Stats" {...a11yProps(1)} />
                <Tab label="Weapon Stats" {...a11yProps(2)} />
                <Tab label="Monster Stats" {...a11yProps(3)} />
                <Tab label="Combat Tracker" {...a11yProps(4)} />
                <Tab label="About" {...a11yProps(5)} />
              </Tabs>
              <ToggleButton onClick={onToggleBg} />
              <PlusButton onClick={onFontSizeLarger} />
              <MinusButton onClick={onFontSizeSmaller} />
              <Button
                className={classes.printIcon}
                variant="contained"
                color="primary"
                onClick={onPrint}
                endIcon={<PrintIcon />}
              >
                Print page
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
        <main className={classes.main}>
          <TabPanel value={value} index={0}>
            <ItemStatsLayout />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SpellStatsLayout />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <WeaponStatsLayout />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <MonsterStatsLayout />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <CombatTrackerLayout />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <AboutLayout />
          </TabPanel>
        </main>
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default App
