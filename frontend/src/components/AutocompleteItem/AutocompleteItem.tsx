import { Paper } from '@mui/material'
import { withStyles } from 'tss-react/mui'

export const AutoCompleteItem = withStyles(Paper, (theme) => ({
  root: {
    '& .MuiAutocomplete-listbox': {
      "& .MuiAutocomplete-option[aria-selected='true']": {
        background: theme.palette.secondary.main,
        '&.Mui-focused': {
          background: theme.palette.secondary.main
        }
      },
      '& .MuiAutocomplete-groupLabel': {
        background: theme.palette.secondary.main
      }
    },
    '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
      background: theme.palette.primary.dark
    }
  }
}))
