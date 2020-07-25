import { makeStyles } from '@material-ui/core'
import statblockparch from 'assets/statblockparch.jpg'

export const useStyles = makeStyles((theme) => ({
  main: {
    padding: "0 1em 2em 1em",
    maxWidth: "1280px",
    margin: "0 auto",
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
