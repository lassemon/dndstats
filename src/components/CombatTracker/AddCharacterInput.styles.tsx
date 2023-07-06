import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
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
      width: '6.5em'
    }
  },
  nameField: {
    '&&': {
      width: '12em'
    }
  },
  hpField: {
    '&&': {
      width: '10em'
    }
  }
}))

export default useStyles
