import React from 'react'
import { Typography, TypographyProps } from '@mui/material'

const PageHeader: React.FC<TypographyProps> = ({ children, sx, ...passProps }) => {
  return (
    <Typography
      variant="h4"
      sx={{
        ...{ textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 'bold' },
        ...sx
      }}
      color="secondary"
      {...passProps}
    >
      {children}
    </Typography>
  )
}

export default PageHeader
