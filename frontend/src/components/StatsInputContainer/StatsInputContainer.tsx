import React from 'react'

import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  root: {
    minHeight: '100%',
    background: theme.palette.primary.main,
    position: 'relative',
    padding: '1em 1em 3em 1em',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.4em',
    boxSizing: 'border-box',
    '&& > .MuiBox-root': {
      height: '100%',
      background: theme.palette.primary.main,
      position: 'relative',
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column',
      gap: '2em',
      boxSizing: 'border-box'
    }
  }
}))

interface StatsInputContainerProps {
  className?: string
}

export const StatsInputContainer: React.FC<StatsInputContainerProps> = (props) => {
  const { children, className = '' } = props
  const { classes } = useStyles()

  return <div className={`${classes.root} ${className}`}>{children}</div>
}

export default StatsInputContainer
