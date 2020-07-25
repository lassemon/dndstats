import { AppBar, Box, Button, Tab, Tabs, ThemeProvider, Toolbar } from '@material-ui/core'
import PrintIcon from '@material-ui/icons/Print'
import TabPanel from 'components/TabPanel'
import AboutLayout from 'layouts/AboutLayout'
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
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

const App: React.FC = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue)
  }

  const onPrint = (event: any) => {
    window.print()
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
                scrollButtons="auto"
              >
                <Tab label="Item Stats" {...a11yProps(0)} />
                <Tab label="Spell Stats" {...a11yProps(1)} />
                <Tab label="Weapon Stats" {...a11yProps(2)} />
                <Tab label="Monster Stats" {...a11yProps(3)} />
                <Tab label="About" {...a11yProps(4)} />
              </Tabs>
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
            <AboutLayout />
          </TabPanel>
        </main>
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default App
