import { CircularProgress, Paper, PaperProps } from '@mui/material'
import React from 'react'

const LoadingIndicator: React.FC<PaperProps> = ({ ...paperProps }) => {
  return (
    <Paper
      elevation={0}
      {...paperProps}
      sx={{
        ...{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center'
        },
        ...paperProps.sx
      }}
    >
      <CircularProgress color="secondary" />
    </Paper>
  )
}

export default LoadingIndicator
