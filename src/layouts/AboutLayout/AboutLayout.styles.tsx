import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      flex: "1 1 100%",
      margin: 0,
    },
    "& > h6": {
      margin: "2em 0 0 0",
    },
  },
}))

export default useStyles
