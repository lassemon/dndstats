import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    '@media print': {
      '&&&': {
        width: '100%',
        display: 'flex',
        flexDirection: 'column-reverse'
      }
    }
  },
  rootPortrait: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em'
  },
  rootLandscape: {
    display: 'flex'
  },
  unsaved: {
    position: 'relative',
    '&:after': {
      content: '"*"',
      color: theme.palette.grey[100],
      width: '100%',
      fontFamily: 'Consolas',
      fontSize: '3em',
      lineHeight: '0.4em',
      fontWeight: '600',
      position: 'absolute',
      top: 0,
      left: 0,
      textAlign: 'right',
      transform: 'translate(3px, -2px)',
      zIndex: '10',
      textShadow: '0px 0px 3px rgba(0,0,0,0.6)'
    }
  },
  characterCardContainerPortrait: {
    '&&': {
      width: '100%'
    }
  },
  characterCardContainerLandscape: {
    //flex: '1 1 65%'
  },
  rightContainer: {
    flex: '1 0 25%',
    display: 'flex',
    gap: '0.5em',
    flexDirection: 'column',
    margin: '0 0 0 8px',
    '& > img': {
      width: '100%'
    }
  },
  imageContainer: {
    '&:hover, &active': {
      resize: 'both',
      overflow: 'hidden'
    },

    minWidth: '150px',
    minHeight: '150px',
    margin: '0 auto'
  },
  monsterActionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em'
  },
  hidden: {
    visibility: 'hidden'
  },
  mainDescription: {
    background: '#e0e4c3',
    padding: '0',
    borderTop: '3px solid #1b1b1b',
    borderBottom: '3px solid #1b1b1b',
    boxShadow: theme.custom.boxShadow,
    breakInside: 'avoid'
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
    margin: '0.8em',
    whiteSpace: 'pre-wrap',
    width: 'fit-content',
    '& p': {
      margin: 0
    }
  },
  inlineDescription: {
    display: 'inline'
  },
  autocomplete: {
    '& .MuiAutocomplete-tag': {
      display: 'none'
    },
    '& .MuiInputLabel-animated': {
      transform: 'translate(0, -20px) scale(0.75)'
    },
    '& legend': {
      maxWidth: '100%'
    }
  },
  errorFallback: {
    width: '60%'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
