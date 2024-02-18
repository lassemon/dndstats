import { AppBar, Box, Button, Divider, IconButton, Menu, MenuItem, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import PrintIcon from '@mui/icons-material/Print'
import LoadingIndicator from 'components/LoadingIndicator'
import { makeStyles } from 'tss-react/mui'
import { useOrientation } from 'utils/hooks'
import { Link } from 'react-router-dom'
import { clearAll } from 'infrastructure/localStorage/LocalStorage'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import Login from 'components/Login'
import { logout } from 'api/auth'
import { useAtom } from 'jotai'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import { AccountBox, Logout, Person } from '@mui/icons-material'
import useDefaultPage from 'hooks/useDefaultPage'
import StatsPageMenu from './StatsPageMenu'

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
    minHeight: '100%',
    width: '100%'
  },
  main: {
    margin: 0,
    padding: 0,
    width: '100%',
    overflowAnchor: 'none'
  },
  appBar: {
    margin: '0',
    minHeight: '100%'
  },
  tabs: {
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center'
    }
  },
  tabsPortrait: {
    flexGrow: 1,
    minWidth: '170px',
    '& .MuiTabs-flexContainer': {
      flexDirection: 'row-reverse'
    }
  },
  tabsLandscape: {
    flexGrow: 1,
    minWidth: '170px'
  },
  toolbarPortrait: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    margin: '0 2em',
    gap: '1em',
    padding: '0.5em 0'
  },
  toolbarLandscape: {
    flexDirection: 'column',
    margin: '2em 0.5em 0 0.5em',
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

  const [burgerMenuAnchorElement, setBurgerMenuAnchorElement] = React.useState<null | HTMLElement>(null)
  const burgerMenuOpen = Boolean(burgerMenuAnchorElement)

  const onClickBurgerMenu = (event: React.MouseEvent<HTMLElement>) => {
    setBurgerMenuAnchorElement(event.currentTarget)
  }

  const handleBurgerMenuClose = () => {
    setBurgerMenuAnchorElement(null)
  }

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
      goToDefaultPage()
    })
  }

  return (
    <Box display="block" displayPrint="none">
      <AppBar position="static" className={classes.appBar}>
        <Toolbar disableGutters className={isPortrait ? classes.toolbarPortrait : classes.toolbarLandscape}>
          <div style={{ display: 'flex' }}>
            <IconButton size="large" onClick={onClickBurgerMenu}>
              <MenuIcon />
            </IconButton>
            {authState?.loggedIn && (
              <div>
                <IconButton
                  size="large"
                  onClick={handleUserMenu}
                  color="inherit"
                  sx={{
                    color: (theme) => theme.palette.secondary.light
                  }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  elevation={0}
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
                        background: (theme) => theme.status.light
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
                    <MenuItem sx={{ gap: '1em' }}>
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
                    <MenuItem sx={{ gap: '1em' }}>
                      <AccountBox fontSize="small" color="secondary" /> My account
                    </MenuItem>
                  </Link>

                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose()
                      onLogout()
                    }}
                    sx={{ gap: '1em' }}
                  >
                    <Logout fontSize="small" /> Logout {authState.user?.name}
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
          <Menu
            id="menu-burger"
            elevation={0}
            anchorEl={burgerMenuAnchorElement}
            keepMounted
            anchorOrigin={{
              vertical: isPortrait ? 'bottom' : 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            open={burgerMenuOpen}
            onClose={handleBurgerMenuClose}
            slotProps={{
              paper: {
                sx: {
                  background: (theme) => theme.status.light
                }
              }
            }}
          >
            <MenuItem key="print" onClick={handleBurgerMenuClose}>
              <span onClick={onPrint} style={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5em' }}>
                Print page <PrintIcon />
              </span>
            </MenuItem>
          </Menu>

          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            className={`${classes.tabs} ${isPortrait ? classes.tabsPortrait : classes.tabsLandscape}`}
            value={tab}
            onChange={handleTabChange}
            aria-label="dnd stats tabs"
            variant="scrollable"
            scrollButtons={isPortrait}
            allowScrollButtonsMobile
            orientation={isPortrait ? 'horizontal' : 'vertical'}
          >
            <StatsPageMenu onMenuItemClick={clearTab} />
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
                    padding: '0.7em'
                  }}
                />
              )
            })}
          </Tabs>
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
              style={{ whiteSpace: 'nowrap' }}
            >
              Reset All
            </Button>
          </Tooltip>
          <React.Suspense fallback={<LoadingIndicator />}>
            <MenuItem key="login">
              <Login />
            </MenuItem>
          </React.Suspense>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar
