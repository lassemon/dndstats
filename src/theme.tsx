import { createMuiTheme } from '@material-ui/core'

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    status: {
      blood: React.CSSProperties["color"]
      light: React.CSSProperties["color"]
    }
  }
  interface ThemeOptions {
    status: {
      blood: React.CSSProperties["color"]
      light: React.CSSProperties["color"]
    }
  }
}

const theme = createMuiTheme({
  typography: {
    fontSize: 16,
  },
  status: {
    blood: "#922610",
    light: "#f6efdc",
  },
  palette: {
    primary: {
      main: "#eee3c5",
      dark: "#d3c7a6",
    },
    secondary: {
      main: "#c77b09",
    },
  },
  overrides: {
    MuiTextField: {
      root: {
        "& > label": {
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#1b1b1b",
        },
        "& > label.Mui-focused.Mui-focused": {
          color: "#c77b09",
        },
        "& > .MuiInput-underline:after": {
          borderBottom: `2px solid #c77b09`,
        },
        "& > div": {
          marginTop: "24px",
        },
      },
    },
    MuiTabs: {
      indicator: {
        height: "6px",
      },
    },
    MuiTab: {
      wrapper: {
        fontWeight: "bold",
      },
    },
    MuiButton: {
      label: {
        fontWeight: "bold",
      },
    },
  },
})

export default theme
