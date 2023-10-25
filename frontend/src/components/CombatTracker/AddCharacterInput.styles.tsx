import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  addContainer: {
    margin: '0 0 1em 0',
    flex: '0 0 100%',
    display: 'flex',
    '& > div': {
      display: 'flex',
      width: 'auto',
      margin: '0 1em 0 0'
    }
  },
  textField: {
    '& > div': {
      marginTop: '0'
    },
    '& > .Mui-error .MuiOutlinedInput-notchedOutline': {
      borderWidth: '3px'
    }
  },
  initField: {
    '&&': {
      width: '2em'
    }
  },
  nameField: {
    '&&': {
      width: '12em'
    }
  },
  hpField: {
    '&&': {
      width: '3em'
    }
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
