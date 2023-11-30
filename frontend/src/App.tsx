import { AppBar, Box, Button, Tab, Tabs, ThemeProvider, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
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
import LoadingIndicator from 'components/LoadingIndicator'
import { clearAll } from 'services/store'

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

  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue)
  }

  const onPrint = () => {
    window.print()
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
                    return (
                      <Tab
                        label={TABS[tab]}
                        value={`${tab}`}
                        component={Link}
                        to={tab}
                        key={tab}
                        {...a11yProps(5)}
                        sx={{
                          padding: isSmall ? '0.3em' : ''
                        }}
                      />
                    )
                  })}
                </Tabs>

                <Button variant="contained" color="primary" onClick={onPrint} endIcon={<PrintIcon />}>
                  Print page
                </Button>
                <Tooltip
                  title={
                    <>
                      <Typography variant="h6">WARNING!</Typography>
                      <Typography variant="body1">Resets everything in ALL VIEWS to default values</Typography>
                    </>
                  }
                  placement="top-end"
                >
                  <Button
                    variant="contained"
                    onClick={async () => {
                      await clearAll()
                      window.location.reload()
                    }}
                  >
                    Reset All
                  </Button>
                </Tooltip>
              </Toolbar>
            </AppBar>
          </Box>
          <main className={classes.main}>
            <React.Suspense fallback={<LoadingIndicator />}>
              <Outlet />
            </React.Suspense>
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
