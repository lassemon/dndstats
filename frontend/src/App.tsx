import { AppBar, Box, Button, Tab, Tabs, ThemeProvider, Toolbar } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import statblockparch from 'assets/statblockparch.jpg'
import statblockparchwhite from 'assets/statblockparch_white.jpg'
import MinusButton from 'components/MinusButton'
import PlusButton from 'components/PlusButton'
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
import { Routes, Route, Outlet, Link } from 'react-router-dom'

import useStyles from './App.styles'

const TABS = {
  '/item': 'Item Stats',
  '/spell': 'Spell Stats',
  '/weapon': 'Weapon Stats',
  '/monster': 'Monster Stats',
  '/combattracker': 'Combat Tracker',
  '/about': 'About'
} as { [key: string]: string }

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const App: React.FC = () => {
  const { classes } = useStyles()
  const [value, setValue] = useState(Object.keys(TABS).includes(window.location.pathname) ? window.location.pathname : '/item')

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue)
  }

  const onPrint = () => {
    window.print()
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

  const Main = () => {
    return (
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <Box display="block" displayPrint="none">
            <AppBar position="static" className={classes.appBar}>
              <Toolbar disableGutters className={classes.toolbar}>
                <Tabs
                  textColor="secondary"
                  indicatorColor="secondary"
                  className={classes.tabs}
                  value={value}
                  onChange={handleChange}
                  aria-label="dnd stats tabs"
                  variant="scrollable"
                  orientation="vertical"
                >
                  {Object.keys(TABS).map((tab) => {
                    return <Tab label={TABS[tab]} value={`${tab}`} component={Link} to={tab} key={tab} {...a11yProps(5)} />
                  })}
                </Tabs>
                <Toolbar disableGutters>
                  <ToggleButton onClick={onToggleBg} />
                  <PlusButton onClick={onFontSizeLarger} />
                  <MinusButton onClick={onFontSizeSmaller} />
                </Toolbar>
                <Button variant="contained" color="primary" onClick={onPrint} endIcon={<PrintIcon />}>
                  Print page
                </Button>
              </Toolbar>
            </AppBar>
          </Box>
          <main className={classes.main}>
            <Outlet />
          </main>
        </ThemeProvider>
      </RecoilRoot>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route index element={<ItemStatsLayout />} />
        <Route path="item" element={<ItemStatsLayout />} />
        <Route path="spell" element={<SpellStatsLayout />} />
        <Route path="weapon" element={<WeaponStatsLayout />} />
        <Route path="monster" element={<MonsterStatsLayout />} />
        <Route path="combattracker" element={<CombatTrackerLayout />} />
        <Route path="about" element={<AboutLayout />} />

        {/* Using path="*"" means "match anything", so this route
                    acts like a catch-all for URLs that we don't have explicit
                    routes for. */}
        <Route path="*" element={<ItemStatsLayout />} />
      </Route>
    </Routes>
  )
}

export default App
