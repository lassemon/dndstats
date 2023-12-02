import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex'
  },
  imageContainer: {
    margin: '0 0 0 2em',
    '& > img': {
      width: '100%'
    }
  },
  mainDescription: {
    background: '#e0e4c3',
    padding: '0',
    borderTop: '3px solid #1b1b1b',
    borderBottom: '3px solid #1b1b1b',
    boxShadow: theme.custom.boxShadow
  },
  monsterContainer: {
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
  featureName: {
    margin: '1em 0 0.2em 0',
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    color: theme.status.blood,
    fontSize: '1.3rem',
    letterSpacing: '1px',
    fontVariant: 'small-caps',
    borderBottom: `1px solid ${theme.status.blood}`
  },
  baseStatsContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > div > span:first-of-type': {
      padding: '0 .5em 0 0'
    }
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
    flexBasis: '16.6%',
    textAlign: 'center'
  },
  rowBreak: {
    flexBasis: '100%',
    height: 0
  },
  statValue: {
    color: theme.status.blood,
    flexBasis: '16.6%',
    textAlign: 'center',
    '& > span': {
      display: 'inline-block',
      padding: '4px'
    }
  },
  actionRow: {
    margin: '0 0 0.5em 0'
  },
  actionName: {
    color: '#1b1b1b',
    fontSize: '1em',
    display: 'inline',
    letterSpacing: '1px',
    fontVariant: 'small-caps',
    fontStyle: 'italic',
    padding: '0 4px 0 0'
  },
  blockDescription: {
    margin: '0.8em'
  },
  inlineDescription: {
    display: 'inline'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
