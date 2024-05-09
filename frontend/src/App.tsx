import { ThemeProvider } from '@mui/material'
import AboutLayout from 'layouts/AboutLayout'
import CombatTrackerLayout from 'layouts/CombatTrackerLayout'
import ItemStatsLayout from 'layouts/ItemStatsLayout'
import MonsterStatsLayout from 'layouts/MonsterStatsLayout'
import SpellStatsLayout from 'layouts/SpellStatsLayout'
import WeaponStatsLayout from 'layouts/WeaponStatsLayout'
import React from 'react'
import theme from 'theme'
import { Routes, Route, Outlet } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import useStyles from './App.styles'
import LoadingIndicator from 'components/LoadingIndicator'
import { useOrientation } from 'utils/hooks'

import ErrorDisplay from 'components/ErrorDisplay'
import ErrorFallback from 'components/ErrorFallback'

import NavBar from 'components/NavBar'
import AccountPage from 'layouts/AccountPage'
import ProfilePage from 'layouts/PorfilePage'
import ItemsPage from 'layouts/ItemsPage'
import FrontPage from 'layouts/FrontPage'

const App: React.FC = () => {
  const { classes } = useStyles()
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

  const Main = () => {
    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root} style={isPortrait ? { flexDirection: 'column' } : {}}>
          <React.Suspense fallback={<LoadingIndicator />}>
            <NavBar />
          </React.Suspense>
          <main
            className={classes.main}
            style={{ flex: isPortrait ? '1 1 auto' : '', display: isPortrait ? 'flex' : '', flexDirection: 'column' }}
          >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <React.Suspense fallback={<LoadingIndicator />}>
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
        <Route index element={<FrontPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="card/item" element={<ItemStatsLayout />} />
        <Route path="card/item/:itemId" element={<ItemStatsLayout />} />
        <Route path="card/spell" element={<SpellStatsLayout />} />
        <Route path="card/weapon" element={<WeaponStatsLayout />} />
        <Route path="card/monster" element={<MonsterStatsLayout />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="combattracker" element={<CombatTrackerLayout />} />
        <Route path="about" element={<AboutLayout />} />

        {/* Using path="*"" means "match anything", so this route
                    acts like a catch-all for URLs that we don't have explicit
                    routes for. */}
        <Route path="*" element={<FrontPage />} />
      </Route>
    </Routes>
  )
}

export default App
