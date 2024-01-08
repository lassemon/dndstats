import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { Typography } from '@mui/material'

export const useStyles = makeStyles()((theme) => ({
  header: {
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    margin: '0',
    color: theme.status.blood,
    letterSpacing: '0.02em',
    fontVariant: 'small-caps'
  },
  actionsHeader: {
    fontSize: '1.8em',
    margin: '0 0 0.5em 0',
    borderBottom: `1px solid ${theme.status.blood}`
  }
}))

const CardTitle: React.FC = (props) => {
  const { children } = props
  const { classes } = useStyles()
  return (
    <Typography variant="h2" className={`${classes.header} ${classes.actionsHeader}`}>
      {children}
    </Typography>
  )
}

export default CardTitle
