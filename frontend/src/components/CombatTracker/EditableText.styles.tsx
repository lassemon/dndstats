import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    margin: '0.6em 0 0.8em 0',
    cursor: 'pointer',
    '&.editing': {
      marginLeft: '0.5em'
    }
  },
  textMode: {
    cursor: 'pointer',
    fontSize: '1.2em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    lineHeight: 'normal',
    verticalAlign: 'bottom',
    textAlign: 'center'
  },
  labelMode: {
    fontSize: '1em'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
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
    marginInlineStart: '0.5em',
    whiteSpace: 'nowrap'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
