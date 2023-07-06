import { makeStyles } from '@material-ui/core'

const width = 120

export const useStyles = makeStyles((theme) => ({
  textField: {
    '& > div': {
      marginTop: '0'
    },
    '& > .Mui-error .MuiOutlinedInput-notchedOutline': {
      borderWidth: '3px'
    }
  },
  nameField: {
    '&&': {
      minWidth: `${width + 3}px`,
      maxWidth: `${width + 3}px`
    }
  },
  nameText: {
    '&&': {
      flex: `0 1 ${width}px`
    },
    cursor: 'pointer',
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
    padding: '0 1em 0 0',
    fontSize: '1.2em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block'
  }
}))

export default useStyles
