import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.status.light,
    height: '100%',
    '&& > *': {
      margin: 0,
      padding: '0 1rem 0 2rem'
    },
    '&& > *:first-child': {
      paddingTop: '1rem'
    },
    '&& > *:last-child': {
      paddingBottom: '1rem'
    },
    '&& > h6': {
      margin: '2em 0 0 0'
    }
  }
}))

export default useStyles
