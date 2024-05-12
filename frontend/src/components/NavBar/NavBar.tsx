import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { useOrientation } from 'utils/hooks'
import { Link } from 'react-router-dom'
import CardMenu from './CardMenu'
import logo from 'assets/logo_small.png'
import AccountMenu from './AccountMenu'
import LoginMenu from './LoginMenu'
import SiteActionsMenu from './SiteActionsMenu'

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

const ToFrontPageLink: React.FC<{ clearTab: () => void }> = ({ clearTab }) => {
  return (
    <Link
      to="/"
      onClick={() => {
        clearTab()
      }}
      style={{ color: 'inherit', textDecoration: 'inherit' }}
    >
      <span
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1em 0 0 0',
          fontSize: '1.3em',
          gap: '0.6em'
        }}
      >
        <img alt="logo" height="50px" src={logo} />
        <Typography variant="body1" sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
          DM's Tool
        </Typography>
      </span>
    </Link>
  )
}

const NavBar: React.FC = () => {
  const { classes } = useStyles()

  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'

  const [tab, setTab] = useState<string | boolean>(Object.keys(TABS).includes(window.location.pathname) ? window.location.pathname : false)

  useEffect(() => {
    setTab(Object.keys(TABS).includes(window.location.pathname) ? window.location.pathname : false)
  }, [window.location.pathname])

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setTab(newValue)
  }

  const clearTab = () => {
    setTab(false)
  }

  return (
    <Box
      display="block"
      displayPrint="none"
      sx={{ background: (theme) => theme.palette.primary.main, boxShadow: 'rgb(0, 0, 0) 2px 0px 7px -5px' }}
    >
      <Box sx={{ position: 'relative', width: isPortrait ? '100%' : '185px' }}>
        <Box sx={{ width: isPortrait ? '100%' : '185px', height: isPortrait ? '' : '100dvh', position: isPortrait ? 'static' : 'fixed' }}>
          <ToFrontPageLink clearTab={clearTab} />
          <AppBar
            position="static"
            className={classes.appBar}
            elevation={0}
            sx={{ width: isPortrait ? '100%' : '185px', height: isPortrait ? '100%' : '93%' }}
          >
            <Toolbar
              disableGutters
              className={isPortrait ? classes.toolbarPortrait : classes.toolbarLandscape}
              sx={{ height: isPortrait ? '' : '100%', display: 'flex', justifyContent: 'space-between' }}
            >
              <Box>
                <AccountMenu />
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
                  sx={{
                    width: isPortrait ? '100%' : '185px'
                  }}
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
                {!isPortrait && <LoginMenu />}
              </Box>
            </Toolbar>
            <Box sx={{ position: isPortrait ? 'absolute' : 'static', left: '1em', top: '1em' }}>
              <SiteActionsMenu />
            </Box>
            {isPortrait && <LoginMenu />}
          </AppBar>
        </Box>
      </Box>
    </Box>
  )
}

export default NavBar
