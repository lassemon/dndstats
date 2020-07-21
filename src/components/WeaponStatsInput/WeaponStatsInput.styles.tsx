import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.status.light,
    padding: "1em 1em",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 0 1.5rem #867453",
    "-webkit-print-color-adjust": "exact",
    "-webkit-filter": "opacity(1)",
    display: "flex",
    flexDirection: "column",
    "& > *": {
      flex: "1 1 100%",
      margin: "0 0 3em 0",
    },
  },
  featureContainer: {
    background: theme.palette.primary.dark,
    display: "flex",
    flexDirection: "column",
    padding: "1em",
    margin: "0 0 3em 0",
    "& > *:not(:last-child)": {
      flex: "1 1 100%",
      margin: "0 0 2em 0",
    },
  },
  deleteButtonContainer: {
    alignSelf: "flex-end",
  },
  deleteButton: {
    color: theme.status.blood,
  },
  bottomButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
}))

export default useStyles
