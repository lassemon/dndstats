import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  statsContainer: {
    '& .stats-background': {
      backgroundPositionY: 'top'
    },
    '& .tapered-rule': {
      width: '14em'
    }
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
  baseStatsContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > div': {
      margin: '0 0 0.3em 0'
    },
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
    fontSize: '1.1em',
    fontWeight: 'bold',
    lineHeight: '1.2em'
  },
  statHeaderNewLine: {
    display: 'block'
  },
  statValue: {
    color: theme.status.blood,
    display: 'inline-block',
    textTransform: 'capitalize'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
