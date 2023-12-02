import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    '& .stats-background': {
      backgroundPositionY: 'top'
    }
  },
  name: {
    margin: '0',
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    color: theme.status.blood,
    fontSize: '2em',
    letterSpacing: '1px',
    fontVariant: 'small-caps'
  },
  baseStatsContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > div': {
      margin: '0 0 0.2em 0'
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
    fontSize: '1.2em',
    fontWeight: 'bold',
    flexBasis: '16.6%',
    textAlign: 'center'
  },
  statValue: {
    color: theme.status.blood,
    flexBasis: '16.6%',
    textTransform: 'capitalize',
    display: 'inline-block',
    marginInlineStart: '0.5em'
  },
  rowBreak: {
    flexBasis: '100%',
    height: 0
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
