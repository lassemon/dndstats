import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    background: theme.palette.primary.main,
    position: 'relative',
    padding: '1em 1em 10em 1em',
    backgroundSize: 'cover',
    boxShadow: '0.1rem 0 0.2rem #afaba5, 0.2rem 0 0.2rem #afaba5',
    display: 'flex',
    flexDirection: 'column',
    gap: '3em',
    boxSizing: 'border-box'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
