import './App.css'

import { AppBar, Tab, Tabs, ThemeProvider, useMediaQuery } from '@material-ui/core'
import TabPanel from 'components/TabPanel'
import ItemStatsLayout from 'layouts/ItemStatsLayout'
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
              >
                <Tab label="Item Stats" {...a11yProps(0)} />
                <Tab label="Weapon Stats" {...a11yProps(1)} />
                {/*<Tab label="Monster Stats" {...a11yProps(2)} /> */}
              </Tabs>
            </AppBar>
          )}
          <TabPanel value={value} index={0}>
            <ItemStatsLayout />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <WeaponStatsLayout />
          </TabPanel>
          <TabPanel value={value} index={2}>
            TBA
          </TabPanel>
        </main>
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default App
