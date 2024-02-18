import React from 'react'
import { Typography } from '@mui/material'

const PageHeader: React.FC = ({ children }) => {
  return (
    <Typography variant="h4" sx={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 'bold' }} color="secondary">
      {children}
    </Typography>
  )
}

export default PageHeader
