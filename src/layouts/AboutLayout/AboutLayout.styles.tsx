import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.status.light,
    padding: "1em 1em",
    margin: "1.7em 0 0 0",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 0 1.5rem #867453",
    "-webkit-print-color-adjust": "exact",
    "-webkit-filter": "opacity(1)",
    display: "flex",
    flexDirection: "column",
    "& > *": {
      flex: "1 1 100%",
    },
    "& > h6": {
      margin: "2em 0 0 0",
    },
  },
}))

export default useStyles
