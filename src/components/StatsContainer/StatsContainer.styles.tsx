import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
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
    boxShadow: theme.custom.boxShadow,
    '-webkit-print-color-adjust': 'exact',
    '-webkit-filter': 'opacity(1)'
  },
  margins: {
    padding: '1em'
  }
}))

export default useStyles
