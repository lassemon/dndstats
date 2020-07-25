import { makeStyles } from '@material-ui/core'
import statblockparch from 'assets/statblockparch.jpg'

export const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    margin: "0 4px",
    padding: "1em",
    background: "#fdf1dc",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url(${statblockparch})`,
    boxShadow: theme.custom.boxShadow,
    "-webkit-print-color-adjust": "exact",
    "-webkit-filter": "opacity(1)",
  },
}))

export default useStyles
