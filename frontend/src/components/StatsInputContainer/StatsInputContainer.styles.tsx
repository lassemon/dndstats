import { makeStyles } from 'tss-react/mui'

const inputContainerStyles = {}

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    background: theme.palette.primary.main,
    position: 'relative',
    padding: '1em 1em 0 1em',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    gap: '2em',
    boxSizing: 'border-box',
    '&& .MuiBox-root': {
      height: '100%',
      background: theme.palette.primary.main,
      position: 'relative',
      padding: '1em 1em 10em 1em',
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column',
      gap: '2em',
      boxSizing: 'border-box'
    }
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
