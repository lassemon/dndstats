import { makeStyles } from 'tss-react/mui';

const width = 120

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
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
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
