import { makeStyles } from '@material-ui/core'
import statblockbar from 'assets/statblockbar.jpg'
import statblockparch from 'assets/statblockparch.jpg'

export const useStyles = makeStyles((theme) => ({
  root: {
    background: "#fdf1dc",
    padding: "1em 1em 0",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url(${statblockparch})`,
    boxShadow: "0 0 1.5rem #867453",
    "-webkit-print-color-adjust": "exact",
    "-webkit-filter": "opacity(1)",
  },
  topContainer: {
    display: "flex",
    margin: "0.7em 0 2em 0",
    "& img": {
      margin: "0.7em 0 0 0.7em",
    },
  },
  headerContainer: {
    flex: "1 1 auto",
  },
  orangeBorder: {
    display: "block",
    background: "#e69a28",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url(${statblockbar})`,
    border: "1px solid #000",
    height: "5px",
    padding: "0 10px 0",
    margin: "-1em -1em 0",
    boxSizing: "initial",
  },
  name: {
    margin: "0.4rem 0 0 0",
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    color: theme.status.blood,
    fontSize: "1.7rem",
    letterSpacing: "1px",
    fontVariant: "small-caps",
  },
  shortDescription: {
    marginTop: 0,
    fontWeight: "normal",
    fontStyle: "italic",
    fontSize: "0.95rem",
  },
  mainDescription: {
    background: "#e0e4c3",
    padding: "1em",
    margin: "0 0 2em 0",
    borderTop: "3px solid #1b1b1b",
    borderBottom: "3px solid #1b1b1b",
  },
  description: {
    display: "inline",
    marginBottom: "1rem",
  },
  featureName: {
    color: "#1b1b1b",
    fontSize: "1rem",
    display: "inline",
    letterSpacing: "1px",
    fontVariant: "small-caps",
    padding: "0 4px 0 1em",
  },
}))

export default useStyles
