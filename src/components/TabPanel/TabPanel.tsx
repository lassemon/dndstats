import { Box } from '@mui/material'
import React from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  index: number
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  )
}

export default TabPanel
