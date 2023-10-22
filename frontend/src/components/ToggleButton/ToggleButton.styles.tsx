import { makeStyles } from 'tss-react/mui';

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  onButton: {
    color: theme.palette.secondary.main
  },
  offButton: {
    color: theme.palette.secondary.dark
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
