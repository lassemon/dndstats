import { Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { StorageParseError, StorageSyncError } from 'domain/errors/StorageError'
import { useAtom } from 'jotai'
import React from 'react'
import { errorState } from 'infrastructure/dataAccess/atoms'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const ErrorDisplay: React.FC = () => {
  const [error, setError] = useAtom(errorState)

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setError(null)
  }

  if (!error) {
    return null
  }

  let errorHeader = `Error: `

  switch (error.constructor) {
    case StorageSyncError:
      errorHeader += 'Saving change to storage failed. This is most commonly caused by too large image file. Try uploading a smaller image.'
      break
    case StorageParseError:
      errorHeader += 'Invalid data. Parsing failed!'
      break
    default:
      errorHeader += (error as any)?.statusText || 'Unknown error'
  }

  return (
    <Snackbar open={!!error} autoHideDuration={12000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        <Typography variant="body2">{errorHeader}</Typography>
        <Typography variant="caption" sx={{ margin: '0 0 0 1em' }}>
          {error.message}
        </Typography>
      </Alert>
    </Snackbar>
  )
}

export default ErrorDisplay
