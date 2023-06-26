import { makeStyles } from '@mui/material'

export const useStyles = makeStyles((theme) => ({
  main: {
    padding: '0 1em 2em 1em',
    maxWidth: '98vw',
    margin: '0 auto'
  },
  appBar: {
    margin: '0 0 1em 0'
  },
  tabs: {
    flexGrow: 1
  },
  printIcon: {
    whiteSpace: 'nowrap',
    minWidth: 'auto',
    margin: '0 0 0 1em'
  }
}))

export default useStyles
