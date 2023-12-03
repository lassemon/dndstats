import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    '& .stats-background': {
      backgroundPositionY: 'top'
    }
  },
  rootFlex: {
    display: 'flex'
  },
  statsColumnLeft: {
    maxWidth: '38em'
  },
  statsColumnRight: {
    maxWidth: '40em'
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
    fontSize: '2.3em'
  },
  baseStatsContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > div': {
      margin: '0 0 0.2em 0'
    }
  },
  statsContainer: {
    '& > div': {
      margin: '0 0 0.3em 0'
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
    fontSize: '1.4em',
    fontWeight: 'bold',
    flexBasis: '16.6%',
    textAlign: 'center'
  },
  statValue: {
    color: theme.status.blood,
    fontSize: '1.3em',
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
  actionContainer: {
    margin: '0 0 0.5em 0'
  },
  actionName: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    padding: '0 0.5em 0 0'
  },
  actionDescription: {}
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
