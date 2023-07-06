import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  main: {
    margin: 0,
    padding: 0,
    width: '100%'
  },
  appBar: {
    margin: '0',
    minHeight: '100%'
  },
  tabs: {
    flexGrow: 1
  },
  printIcon: {
    whiteSpace: 'nowrap',
    minWidth: 'auto',
    margin: '0 0 0 1em'
  },
  toolbar: {
    flexDirection: 'column',
    margin: '2em 0 0 0'
  }
}))

export default useStyles
