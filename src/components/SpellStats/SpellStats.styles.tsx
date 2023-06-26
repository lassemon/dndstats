import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  container: {
    width: '25%'
  },
  imageContainer: {
    '& > img': {
      width: '100%'
    }
  },
  topContainer: {
    display: 'flex',
    margin: '0 0 1em 0'
  },
  headerContainer: {
    flex: '1 0 60%'
  },
  name: {
    margin: '0',
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    color: theme.status.blood,
    fontSize: '1.7em',
    letterSpacing: '1px',
    fontVariant: 'small-caps'
  },
  shortDescription: {
    marginTop: 0,
    fontWeight: 'normal',
    fontStyle: 'italic',
    fontSize: '0.95em'
  },
  mainDescription: {
    padding: '0',
    margin: '0 0 0 0'
  },
  blockDescription: {
    margin: '0'
  },
  inlineDescription: {
    display: 'inline'
  },
  featureName: {
    color: '#1b1b1b',
    fontSize: '1em',
    display: 'inline',
    letterSpacing: '1px',
    fontVariant: 'small-caps',
    padding: '0 4px 0 0'
  }
}))

export default useStyles
