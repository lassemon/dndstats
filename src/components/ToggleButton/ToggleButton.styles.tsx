import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  onButton: {
    color: theme.palette.secondary.main
  },
  offButton: {
    color: theme.palette.secondary.dark
  }
}))

export default useStyles
