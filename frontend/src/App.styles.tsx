import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()(() => ({
  main: {
    margin: 0,
    padding: 0,
    width: '100%'
  },
  appBar: {
    margin: '0',
    minHeight: '100%'
  },
  tabs: {
    flexGrow: 1,
    minWidth: '170px'
  },
  toolbar: {
    flexDirection: 'column',
    margin: '2em 0 0 0',
    gap: '1em'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
