import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    background: theme.palette.primary.main,
    position: 'relative',
    padding: '1em 1em',
    backgroundSize: 'cover',
    boxShadow: '0.1rem 0 0.2rem #afaba5, 0.2rem 0 0.2rem #afaba5',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    '&& > *': {
      flex: '1 1 100%',
      margin: '0 0 3em 0'
    }
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
