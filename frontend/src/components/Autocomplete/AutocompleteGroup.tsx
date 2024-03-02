import { styled, lighten, darken } from '@mui/system'

export const AutocompleteGroupHeader = styled('div')(({ theme }) => {
  const autoCompleteColors = theme.palette.augmentColor({ color: { main: theme.palette.primary.dark } })
  return {
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: autoCompleteColors.contrastText,
    backgroundColor: autoCompleteColors.light
  }
})

export const AutocompleteGroupItems = styled('ul')({
  padding: 0
})
