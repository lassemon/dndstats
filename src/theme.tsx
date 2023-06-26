import { Theme, createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      blood: React.CSSProperties['color']
      light: React.CSSProperties['color']
    }
    custom: {
      boxShadow: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status: {
      blood: React.CSSProperties['color']
      light: React.CSSProperties['color']
    }
    custom: {
      boxShadow: string
    }
  }
}

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
}

const theme = createTheme({
  custom: {
    boxShadow: '0.1rem 0 0.5rem #afaba5, -0.1rem 0 0.5rem #afaba5'
  },
  typography: {
    fontSize: 16
  },
  status: {
    blood: '#922610',
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
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
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
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '6px'
        }
      }
    }
    /*MuiTab: {
      styleOverrides: {
        wrapper: {
          fontWeight: 'bold'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        label: {
          fontWeight: 'bold'
        }
      }
    }*/
  }
})

export default theme
