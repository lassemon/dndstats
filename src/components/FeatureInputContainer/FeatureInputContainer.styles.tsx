import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  featureContainer: {
    background: theme.palette.primary.dark,
    display: 'flex',
    flexDirection: 'column',
    padding: '1em',
    margin: '0.5em 0',
    '& > *:not(:last-child)': {
      flex: '1 1 100%',
      margin: '0 0 2em 0'
    }
  },
  deleteButtonContainer: {
    alignSelf: 'flex-end'
  }
}))

export default useStyles
