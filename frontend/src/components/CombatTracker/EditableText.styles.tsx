import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  textMode: {
    cursor: 'pointer',
    fontSize: '1.2em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
