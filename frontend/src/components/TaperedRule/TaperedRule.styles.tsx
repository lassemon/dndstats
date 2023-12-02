import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  taperedRule: {
    display: 'block',
    width: '100%',
    height: '7px',
    border: 'none',
    color: theme.status.blood,
    fill: theme.status.blood,
    margin: '0.3em 0 0.3em 0'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
