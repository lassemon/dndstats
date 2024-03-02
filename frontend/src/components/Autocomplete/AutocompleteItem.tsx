import { Paper } from '@mui/material'
import { withStyles } from 'tss-react/mui'

export const AutoCompleteItem = withStyles(Paper, (theme) => {
  const autoCompleteColors = theme.palette.augmentColor({ color: { main: theme.palette.primary.dark } })
  return {
    root: {
      '& .MuiAutocomplete-listbox': {
        "& .MuiAutocomplete-option[aria-selected='true']": {
          background: theme.palette.secondary.light,
          '&.Mui-focused': {
            background: theme.palette.secondary.main
          }
        },
        '& .MuiAutocomplete-groupLabel': {
          background: autoCompleteColors.light
        }
      },
      '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
        background: autoCompleteColors.dark
      }
    }
  }
})
