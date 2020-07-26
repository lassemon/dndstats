import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  imageContainer: {
    "& > img": {
      width: "100%",
    },
  },
  textContainer: {
    flex: "1 0 60%",
  },
  name: {
    margin: "0",
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
    padding: "0",
    margin: "1em 0 0 0",
    borderTop: "3px solid #1b1b1b",
    borderBottom: "3px solid #1b1b1b",
  },
  blockDescription: {
    margin: "0.5em",
  },
  inlineDescription: {
    display: "inline",
  },
  featureContainer: {
    margin: "0 0 0.5em 0",
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
