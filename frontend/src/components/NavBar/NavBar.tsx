import { AppBar, Box, Button, Divider, Menu, MenuItem, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PrintIcon from '@mui/icons-material/Print'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import LoadingIndicator from 'components/LoadingIndicator'
import { makeStyles } from 'tss-react/mui'
import { useOrientation } from 'utils/hooks'
import { Link } from 'react-router-dom'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Login from 'components/Login'
import { logout } from 'api/auth'
import { useAtom } from 'jotai'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import { AccountBox, Logout, Person } from '@mui/icons-material'
import useDefaultPage from 'hooks/useDefaultPage'
import CardMenu from './CardMenu'
import { LocalStorageRepository } from 'infrastructure/repositories/LocalStorageRepository'
import logo from 'assets/logo_small.png'

const localStorageRepository = new LocalStorageRepository<any>()

const TABS = {
  '/items': 'Items',
  '/combattracker': 'Combat Tracker',
  '/about': 'About'
} as { [key: string]: string }

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%'
  },
  main: {
    margin: 0,
    padding: 0,
    width: '100%',
    overflowAnchor: 'none'
  },
  appBar: {
    margin: '0'
  },
  tabs: {
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center'
    }
  },
  tabsPortrait: {
    flexGrow: 1,
    minWidth: '170px',
    '& .MuiTabs-flexContainer': {}
  },
  tabsLandscape: {
    flexGrow: 1,
    minWidth: '170px'
  },
  toolbarPortrait: {
    position: 'static',
    justifyContent: 'center',
    margin: '0',
    gap: '1em',
    padding: '0.5em 0'
  },
  toolbarLandscape: {
    flexDirection: 'column',
    margin: '0.5em 0.5em 0 0.5em',
    gap: '1em'
  }
}))

const NavBar: React.FC = () => {
  const { classes } = useStyles()

  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'
  const goToDefaultPage = useDefaultPage()
  const [authState, setAuthState] = useAtom(authAtom)

  const [userMenuAnchorElement, setUserMenuAnchorElement] = React.useState<null | HTMLElement>(null)
  const userMenuOpen = Boolean(userMenuAnchorElement)
  const [tab, setTab] = useState<string | boolean>(Object.keys(TABS).includes(window.location.pathname) ? window.location.pathname : false)

  useEffect(() => {
    setTab(Object.keys(TABS).includes(window.location.pathname) ? window.location.pathname : false)
  }, [window.location.pathname])

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorElement(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorElement(null)
  }

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setTab(newValue)
  }

  const clearTab = () => {
    setTab(false)
  }

  const _printDefer = () => {
    setTimeout(window.print, 100)
  }

  const onPrint = () => {
    _printDefer()
    return false
  }

  const onLogout = () => {
    logout().finally(() => {
      setAuthState(() => {
        return {
          loggedIn: false,
          user: undefined
        }
      })
    })
  }

  return (
    <Box
      display="block"
      displayPrint="none"
      sx={{ background: (theme) => theme.palette.primary.main, boxShadow: 'rgb(0, 0, 0) 2px 0px 7px -5px' }}
    >
      <Link
        to="/"
        onClick={() => {
          clearTab()
          handleUserMenuClose()
        }}
        style={{ color: 'inherit', textDecoration: 'inherit' }}
      >
        <span
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1em 0 0 0', fontSize: '1.3em', gap: '0.6em' }}
        >
          <img alt="logo" height="50px" src={logo} />
          <Typography variant="body1" sx={{ fontWeight: '600' }}>
            DM's Tool
          </Typography>
        </span>
      </Link>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar disableGutters className={isPortrait ? classes.toolbarPortrait : classes.toolbarLandscape}>
          <div style={{ display: 'flex', width: isPortrait ? '' : '100%', justifyContent: 'center' }}>
            {authState?.loggedIn && (
              <>
                <Button
                  size="large"
                  onClick={handleUserMenu}
                  color="inherit"
                  sx={{
                    padding: '0.9em 0.5em',
                    color: (theme) => theme.palette.secondary.light
                  }}
                  fullWidth={isPortrait ? false : true}
                  startIcon={<AccountCircle />}
                >
                  <Typography
                    component={'span'}
                    variant="body1"
                    sx={{
                      fontSize: '1.4rem',
                      lineHeight: '1.4rem',
                      textTransform: 'none'
                    }}
                  >
                    {authState.user?.name}
                  </Typography>
                </Button>

                <Menu
                  id="menu-appbar"
                  elevation={1}
                  anchorEl={userMenuAnchorElement}
                  keepMounted
                  anchorOrigin={{
                    vertical: isPortrait ? 'bottom' : 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  open={userMenuOpen}
                  onClose={handleUserMenuClose}
                  slotProps={{
                    paper: {
                      sx: {
                        background: (theme) => theme.status.light,
                        '& .MuiList-root': {
                          padding: 0
                        }
                      }
                    }
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => {
                      clearTab()
                      handleUserMenuClose()
                    }}
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    <MenuItem sx={{ gap: '1em', padding: '0.7em 1em' }}>
                      <Person fontSize="small" color="secondary" /> Profile
                    </MenuItem>
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => {
                      clearTab()
                      handleUserMenuClose()
                    }}
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    <MenuItem sx={{ gap: '1em', padding: '0.7em 1em' }}>
                      <AccountBox fontSize="small" color="secondary" /> My account
                    </MenuItem>
                  </Link>

                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose()
                      onLogout()
                    }}
                    sx={{ gap: '1em', padding: '0.7em 1em' }}
                  >
                    <Logout fontSize="small" /> Logout {authState.user?.name}
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            className={`${classes.tabs} ${isPortrait ? classes.tabsPortrait : classes.tabsLandscape}`}
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={isPortrait}
            allowScrollButtonsMobile={isPortrait}
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
                    padding: '0.7em',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                />
              )
            })}
            <CardMenu onMenuItemClick={clearTab} />
          </Tabs>

          <div style={{ visibility: authState.loggedIn ? 'hidden' : 'visible' }}>
            <React.Suspense fallback={<LoadingIndicator />}>
              <MenuItem
                key="login"
                sx={{
                  width: isPortrait ? '' : '100%',
                  justifyContent: 'center',
                  position: isPortrait ? 'absolute' : 'static',
                  right: '2em',
                  top: '1em'
                }}
              >
                <Login />
              </MenuItem>
            </React.Suspense>
          </div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: isPortrait ? 'column' : 'row',
              position: isPortrait ? 'absolute' : 'static',
              left: '0.5em',
              top: '0.5em'
            }}
          >
            <Tooltip
              disableInteractive
              title={
                <>
                  <Typography variant="h6">WARNING!</Typography>
                  <Typography variant="body1">Resets everything in ALL VIEWS to default values</Typography>
                </>
              }
              placement="top-end"
            >
              <Button
                onClick={async () => {
                  await localStorageRepository.clearAll()
                  window.location.reload()
                }}
                style={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5em', position: isPortrait ? 'static' : 'fixed', bottom: '5em' }}
              >
                Reset All <RestartAltIcon />
              </Button>
            </Tooltip>
            <Button
              onClick={onPrint}
              style={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5em', position: isPortrait ? 'static' : 'fixed', bottom: '1em' }}
            >
              Print page <PrintIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar
