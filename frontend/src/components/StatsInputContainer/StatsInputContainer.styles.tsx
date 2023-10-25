import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    background: theme.status.light,
    padding: '1em 1em',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: theme.custom.boxShadow,
    //"-webkit-print-color-adjust": "exact",
    //"-webkit-filter": "opacity(1)",
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
