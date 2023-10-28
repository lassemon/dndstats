import { CircularProgress, Paper } from '@mui/material'
import React from 'react'

const LoadingIndicator: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'transparent',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <CircularProgress color="secondary" />
    </Paper>
  )
}

export default LoadingIndicator
