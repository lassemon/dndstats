import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
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

const theme = createTheme({
  custom: {
    boxShadow: '0.1rem 0 0.2rem #afaba5, -0.1rem 0 0.2rem #afaba5'
  },
  typography: {
    fontSize: 16
  },
  status: {
    blood: '#922610',
    lightBlood: '#dfc1a6',
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
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Noto Sans', 'Myriad Pro', Calibri, Helvetica, Arial, sans-serif"
        },
        h1: {
          fontFamily:
            '"Libre Baskerville","Lora","Calisto MT","Bookman Old Style",Bookman,"Goudy Old Style",Garamond,"Hoefler Text","Bitstream Charter",Georgia,serif',
          letterSpacing: '0.04em',
          fontVariant: 'small-caps',
          color: 'rgba(0, 0, 0, 0.6)'
        },
        h2: {
          fontFamily:
            '"Libre Baskerville","Lora","Calisto MT","Bookman Old Style",Bookman,"Goudy Old Style",Garamond,"Hoefler Text","Bitstream Charter",Georgia,serif',
          letterSpacing: '0.04em',
          fontVariant: 'small-caps',
          color: 'rgba(0, 0, 0, 0.6)'
        },
        h3: {
          fontFamily:
            '"Libre Baskerville","Lora","Calisto MT","Bookman Old Style",Bookman,"Goudy Old Style",Garamond,"Hoefler Text","Bitstream Charter",Georgia,serif',
          letterSpacing: '0.04em',
          fontVariant: 'small-caps',
          color: 'rgba(0, 0, 0, 0.6)'
        },
        h4: {
          fontFamily:
            '"Libre Baskerville","Lora","Calisto MT","Bookman Old Style",Bookman,"Goudy Old Style",Garamond,"Hoefler Text","Bitstream Charter",Georgia,serif',
          letterSpacing: '0.04em',
          fontVariant: 'small-caps',
          color: 'rgba(0, 0, 0, 0.6)'
        },
        h5: {
          fontFamily:
            '"Libre Baskerville","Lora","Calisto MT","Bookman Old Style",Bookman,"Goudy Old Style",Garamond,"Hoefler Text","Bitstream Charter",Georgia,serif',
          letterSpacing: '0.04em',
          fontVariant: 'small-caps',
          color: 'rgba(0, 0, 0, 0.6)'
        },
        h6: {
          fontFamily:
            '"Libre Baskerville","Lora","Calisto MT","Bookman Old Style",Bookman,"Goudy Old Style",Garamond,"Hoefler Text","Bitstream Charter",Georgia,serif',
          letterSpacing: '0.04em',
          fontVariant: 'small-caps',
          color: 'rgba(0, 0, 0, 0.6)'
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0.5em 0 0 0',
          width: '100%'
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        listbox: {
          maxHeight: '60vh'
        },
        option: {
          textTransform: 'capitalize'
        }
      },
      defaultProps: {
        selectOnFocus: false,
        ChipProps: {
          sx: {
            borderRadius: 0,
            textTransform: 'capitalize'
          }
        },
        componentsProps: {
          popper: {
            sx: {
              '&[data-popper-placement="bottom"]': {
                padding: '0 0 3em 0'
              }
            }
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      },
      styleOverrides: {
        root: {
          margin: '0.5em 0 0 0',
          '& > label.MuiInputLabel-standard': {
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#1b1b1b',
            whiteSpace: 'nowrap'
          },
          '& > label.MuiInputLabel-standard.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.38)'
          },
          '& legend': {
            fontWeight: 'bold'
          },
          '& > label.Mui-focused.Mui-focused': {
            color: '#c77b09'
          },
          '& > .MuiInput-underline:after': {
            borderBottom: `2px solid #c77b09`
          },
          '& label..MuiInputLabel-standard+div': {
            marginTop: '18px'
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          width: '6px'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 'bold'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        text: {
          fontWeight: 'bold',
          color: 'rgba(0, 0, 0, 0.87)'
        }
      }
    },
    MuiTooltip: {
      defaultProps: {
        enterTouchDelay: 50,
        leaveTouchDelay: 600000 // 10 minutes
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            opacity: '0.5'
          }
        }
      }
    },
    MuiInputLabel: {
      defaultProps: {
        color: 'secondary'
      }
    },
    MuiOutlinedInput: {
      defaultProps: {
        color: 'secondary'
      },
      styleOverrides: {
        notchedOutline: {
          '& > legend': {
            maxWidth: '100%'
          }
        }
      }
    },
    MuiDialog: {
      defaultProps: {
        disableScrollLock: true
      }
    },
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '0px solid transparent'
        }
      }
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          ':after': {
            animationDuration: '1.3s'
          }
        }
      }
    }
  }
})

export default theme

console.log(theme)
