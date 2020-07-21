import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  taperedRule: {
    display: "block",
    width: "100%",
    height: "5px",
    border: "none",
    color: theme.status.blood,
    fill: theme.status.blood,
    margin: "0.5em 0",
  },
}))

export default useStyles
