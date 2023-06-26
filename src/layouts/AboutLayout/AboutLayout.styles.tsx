import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0.5em 0 0 0',
    '&& > *': {
      flex: '1 1 100%',
      margin: 0
    },
    '&& > h6': {
      margin: '2em 0 0 0'
    }
  }
}))

export default useStyles
