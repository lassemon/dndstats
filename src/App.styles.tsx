import { makeStyles } from '@material-ui/core'
import statblockparch from 'assets/statblockparch.jpg'

export const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.up("md")]: {
      padding: "0 2em",
    },
    maxWidth: "1280px",
  },
  appBar: {
    backgroundImage: `url(${statblockparch})`,
    margin: "0 0 2em 0",
  },
  tabs: {
    flexGrow: 1,
  },
  printIcon: {
    whiteSpace: "nowrap",
    minWidth: "auto",
  },
}))

export default useStyles
