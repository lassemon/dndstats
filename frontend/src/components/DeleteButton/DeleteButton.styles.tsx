import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  deleteButton: {
    color: theme.status.blood
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
