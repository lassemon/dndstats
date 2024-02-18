import { ThemeProvider } from '@mui/material'
import AboutLayout from 'layouts/AboutLayout'
import CombatTrackerLayout from 'layouts/CombatTrackerLayout'
import ItemStatsLayout from 'layouts/ItemStatsLayout'
import MonsterStatsLayout from 'layouts/MonsterStatsLayout'
import SpellStatsLayout from 'layouts/SpellStatsLayout'
import WeaponStatsLayout from 'layouts/WeaponStatsLayout'
import React, { lazy } from 'react'
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

const Preloader = lazy(() => import('infrastructure/dataAccess/Preloader'))

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
        <Route path="account" element={<AccountPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="stats/item/:itemId" element={<ItemStatsLayout />} />
        <Route path="stats/spell" element={<SpellStatsLayout />} />
        <Route path="stats/weapon" element={<WeaponStatsLayout />} />
        <Route path="stats/monster" element={<MonsterStatsLayout />} />
        <Route path="items" element={<ItemsPage />} />
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
