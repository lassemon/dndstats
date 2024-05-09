import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    breakInside: 'avoid',
    '& .editing:not(.editing > .editing)': {
      backgroundColor: 'rgba(235,145,20,0.2)',
      borderRadius: '0.5em',
      padding: '0.8em 0.5em 0.5em 0.5em',
      margin: '0 0 1.5em 0',
      breakInside: 'avoid',
      cursor: 'default',
      '& > h2': {
        margin: '-6px 0 0.2em 0'
      },
      '& .editing': {
        padding: 0,
        margin: '0.2em 0 0 0',
        backgroundColor: 'transparent'
      }
    },
    '@media print': {
      '&&': {
        width: '100%'
      }
    }
  },
  staticWidthMedium: {
    width: '40vw'
  },
  staticWidthLarge: {
    width: '100%'
  },
  fullWidth: {
    width: '94vw'
  },
  columns: {
    columnCount: '2',
    columnFill: 'balance'
  },
  header: {
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    margin: '0',
    color: theme.status.blood,
    letterSpacing: '0.02em',
    fontVariant: 'small-caps'
  },
  name: {
    fontSize: '2.3em',
    lineHeight: '2.5rem'
  },
  baseStatsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsContainer: {
    breakInside: 'avoid',
    '& > div': {
      margin: '0.2em 0'
    }
  },
  baseStat: {
    textTransform: 'capitalize'
  },
  statHeader: {
    color: theme.status.blood,
    fontSize: '1.1em',
    lineHeight: '1.2em',
    fontWeight: 'bold',
    flexBasis: '16.6%',
    textAlign: 'center'
  },
  statValue: {
    color: theme.status.blood,
    fontSize: '1em',
    fontFamily: '"Helvetica", "Arial", sans-serif',
    flexBasis: '16.6%',
    textTransform: 'capitalize',
    display: 'inline-block',
    marginInlineStart: '0.5em'
  },
  rowBreak: {
    flexBasis: '100%',
    height: 0
  },
  actionsHeader: {
    fontSize: '1.8em',
    margin: '0.5em 0',
    borderBottom: `1px solid ${theme.status.blood}`
  },
  actionsContainer: {
    breakInside: 'avoid'
  },
  actionContainer: {
    margin: '0 0 0.5em 0',
    fontSize: '1em'
  },
  actionName: {
    fontSize: '1em',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontVariant: 'small-caps',
    letterSpacing: '1px',
    color: `${theme.palette.text.primary}`,
    padding: '0 0.5em 0 0'
  },
  actionDescription: {
    whiteSpace: 'pre-wrap'
  },
  saveButtonContainer: {
    textAlign: 'end'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
