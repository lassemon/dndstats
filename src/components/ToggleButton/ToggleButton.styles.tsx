import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  onButton: {
    color: theme.palette.secondary.main
  },
  offButton: {
    color: theme.palette.secondary.dark
  },
}))

export default useStyles
