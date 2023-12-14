import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  container: {
    width: '60%'
  },
  mediumContainer: {
    width: '80%'
  },
  smallContainer: {
    width: '95%'
  },
  printContainer: {
    width: '100%'
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > img': {
      width: '100%'
    }
  },
  topContainer: {
    display: 'flex',
    margin: '0'
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
  description: {
    marginBottom: '1rem'
  },
  featureName: {
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    color: theme.status.blood,
    fontSize: '1.3em',
    letterSpacing: '1px',
    fontVariant: 'small-caps',
    borderBottom: `1px solid ${theme.status.blood}`
  },
  stats: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  statHeader: {
    color: theme.status.blood,
    fontSize: '1em',
    fontWeight: 'bold',
    lineHeight: '1.2em',
    flexBasis: '33%'
  },
  rowBreak: {
    flexBasis: '100%',
    height: 0
  },
  statValue: {
    flexBasis: '33%',
    background: '#e0e4c3',
    '& > span': {
      display: 'inline-block',
      padding: '4px'
    }
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
