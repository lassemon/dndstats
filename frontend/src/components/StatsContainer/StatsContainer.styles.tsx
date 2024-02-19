import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: '36em',
    overflow: 'hidden',
    margin: '0 auto',
    '&::-webkit-resizer': {
      backgroundColor: 'transparent'
    }
  },
  resizeable: {
    resize: 'both'
  },
  content: {
    height: 'calc(100% - 15px)',
    margin: '0 8px',
    background: '#fdf1dc',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: theme.custom.boxShadow
  },
  margins: {
    padding: '0.7em'
  },
  marginsSmall: {
    padding: '0.7em'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
