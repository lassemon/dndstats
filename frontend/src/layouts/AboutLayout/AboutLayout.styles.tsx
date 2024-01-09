import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    background: theme.status.light,
    height: '100%',
    '&& > *': {
      margin: 0,
      padding: '0 1rem 0 2rem'
    },
    '&& > *:last-child': {
      paddingBottom: '3rem'
    },
    '&& > h6': {
      margin: '1.2em 0 0 0'
    }
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
