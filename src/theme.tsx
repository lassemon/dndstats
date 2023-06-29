import { createMuiTheme } from '@material-ui/core'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    status: {
      blood: React.CSSProperties['color']
      lightBlood: React.CSSProperties['color']
      light: React.CSSProperties['color']
    }
    custom: {
      boxShadow: string
    }
  }
  interface ThemeOptions {
    status: {
      blood: React.CSSProperties['color']
      lightBlood: React.CSSProperties['color']
      light: React.CSSProperties['color']
    }
    custom: {
      boxShadow: string
    }
  }
}

const theme = createMuiTheme({
  custom: {
    boxShadow: '0.1rem 0 0.2rem #afaba5, -0.1rem 0 0.2rem #afaba5'
  },
  typography: {
    fontSize: 16
  },
  status: {
    blood: '#922610',
    lightBlood: '#d0a189',
    light: '#f6efdc'
  },
  palette: {
    primary: {
      main: '#eee3c5',
      dark: '#d3c7a6'
    },
    secondary: {
      main: '#c77b09'
    }
  },
  overrides: {
    MuiFormControl: {
      root: {
        width: '100%'
      }
    },
    MuiTextField: {
      root: {
        '& > label': {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1b1b1b',
          whiteSpace: 'nowrap'
        },
        '& > label.Mui-focused.Mui-focused': {
          color: '#c77b09'
        },
        '& > .MuiInput-underline:after': {
          borderBottom: `2px solid #c77b09`
        },
        '& > div': {
          marginTop: '24px'
        }
      }
    },
    MuiTabs: {
      indicator: {
        height: '6px'
      }
    },
    MuiTab: {
      wrapper: {
        fontWeight: 'bold'
      }
    },
    MuiButton: {
      label: {
        fontWeight: 'bold'
      }
    }
  }
})

export default theme
