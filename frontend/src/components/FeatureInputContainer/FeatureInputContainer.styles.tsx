import { makeStyles } from 'tss-react/mui';

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  featureContainer: {
    background: theme.palette.primary.dark,
    display: "flex",
    flexDirection: "column",
    padding: "1em",
    margin: "0.5em 0",
    "& > *:not(:last-child)": {
      flex: "1 1 100%",
      margin: "0 0 2em 0",
    },
  },
  deleteButtonContainer: {
    alignSelf: "flex-end",
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
