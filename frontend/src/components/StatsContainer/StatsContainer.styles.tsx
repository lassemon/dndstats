import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    resize: 'both',
    overflow: 'hidden',
    margin: '0 auto',
    '&::-webkit-resizer': {
      backgroundColor: 'transparent'
    }
  },
  content: {
    height: 'calc(100% - 15px)',
    margin: '0 8px',
    background: '#fdf1dc',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: theme.custom.boxShadow
    //'-webkit-print-color-adjust': 'exact',
    //'-webkit-filter': 'opacity(1)'
  },
  margins: {
    padding: '1em'
  },
  marginsSmall: {
    padding: '0.5em',
    '& .tapered-rule': {
      margin: '0 0 .2em 0'
    }
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
