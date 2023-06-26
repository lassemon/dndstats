import { makeStyles } from '@mui/material'

export const useStyles = makeStyles((theme) => ({
  deleteButton: {
    color: theme.status.blood
  },
  bottomButtons: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

export default useStyles
