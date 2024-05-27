import { makeStyles } from 'tss-react/mui'
import React from 'react'
import LoadingIndicator from 'components/LoadingIndicator'
import { Box, BoxProps } from '@mui/material'

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '5em',
    margin: '0 1em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '.5em',
    textAlign: 'center'
  },
  title: {
    fontSize: '0.8em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: theme.palette.grey[500]
  },
  amount: {
    fontSize: '2.7em',
    lineHeight: '.8em'
  }
}))

interface ProfileStatProps extends BoxProps {
  title: string
  amount: number
  loading: boolean
}

const ProfileStat: React.FC<ProfileStatProps> = ({ title, amount, loading, ...props }) => {
  const { classes } = useStyles()
  return (
    <Box className={classes.root} {...props}>
      <span className={classes.title}>{title}</span>
      {loading ? <LoadingIndicator /> : <span className={classes.amount}>{amount}</span>}
    </Box>
  )
}

export default ProfileStat
