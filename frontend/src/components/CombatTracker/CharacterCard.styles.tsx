import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {},
  staticWidthMedium: {
    width: '40vw'
  },
  staticWidthLarge: {
    width: '60vw'
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
  shortDescription: {
    marginTop: 0,
    fontWeight: 'normal',
    fontStyle: 'italic',
    fontSize: '0.95em'
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
  abilityScores: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > div': {
      marginInlineStart: '0',
      textAlign: 'center'
    }
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
    margin: '0 0 0.5em 0'
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
  actionDescription: {}
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
