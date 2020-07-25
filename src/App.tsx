import './App.css'

import { AppBar, Tab, Tabs, ThemeProvider, useMediaQuery } from '@material-ui/core'
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
  const isPrint = useMediaQuery("print")

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue)
  }

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <main className={classes.main}>
          {!isPrint && (
            <AppBar position="static" className={classes.appBar}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Item Stats" {...a11yProps(0)} />
                <Tab label="Spell Stats" {...a11yProps(1)} />
                <Tab label="Weapon Stats" {...a11yProps(2)} />
                <Tab label="Monster Stats" {...a11yProps(3)} />
                <Tab label="About" {...a11yProps(4)} />
              </Tabs>
            </AppBar>
          )}
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
