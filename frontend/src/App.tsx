import { AppBar, Box, Button, Tab, Tabs, ThemeProvider, Toolbar, Tooltip, Typography } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import AboutLayout from 'layouts/AboutLayout'
import CombatTrackerLayout from 'layouts/CombatTrackerLayout'
import ItemStatsLayout from 'layouts/ItemStatsLayout'
import MonsterStatsLayout from 'layouts/MonsterStatsLayout'
import SpellStatsLayout from 'layouts/SpellStatsLayout'
import WeaponStatsLayout from 'layouts/WeaponStatsLayout'
import React, { useState } from 'react'
import theme from 'theme'
import { Routes, Route, Outlet, Link } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import useStyles from './App.styles'
import LoadingIndicator from 'components/LoadingIndicator'
import { clearAll } from 'services/store'
import { useOrientation } from 'utils/hooks'
import { Preloader } from 'infrastructure/dataAccess/Preloader'
import ErrorDisplay from 'components/ErrorDisplay'
import ErrorFallback from 'components/ErrorFallback'

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
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

  const _printDefer = () => {
    setTimeout(window.print, 100)
  }

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue)
  }

  const onPrint = () => {
    _printDefer()
    return false
  }

  const Main = () => {
    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root} style={isPortrait ? { flexDirection: 'column' } : {}}>
          <Box display="block" displayPrint="none">
            <AppBar position="static" className={classes.appBar}>
              <Toolbar disableGutters className={isPortrait ? classes.toolbarPortrait : classes.toolbarLandscape}>
                <Tabs
                  textColor="secondary"
                  indicatorColor="secondary"
                  className={`${classes.tabs} ${isPortrait ? classes.tabsPortrait : classes.tabsLandscape}`}
                  value={value}
                  onChange={handleChange}
                  aria-label="dnd stats tabs"
                  variant="scrollable"
                  scrollButtons={isPortrait}
                  allowScrollButtonsMobile
                  orientation={isPortrait ? 'horizontal' : 'vertical'}
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
                          padding: isPortrait ? '0.7em' : ''
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
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <React.Suspense fallback={<LoadingIndicator />}>
                <Preloader />
                <Outlet />
                <ErrorDisplay />
              </React.Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </ThemeProvider>
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
