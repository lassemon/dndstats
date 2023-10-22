import { makeStyles } from 'tss-react/mui';
import statblockbar from 'assets/statblockbar.jpg'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  orangeBorder: {
    position: "relative",
    zIndex: 1,
    display: "block",
    background: "#e69a28",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url(${statblockbar})`,
    border: "1px solid #000",
    height: "5px",
    padding: "0 10px 0",
    margin: "0 3px",
    boxSizing: "initial",
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
