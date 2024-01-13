import { Button } from '@mui/material'
import { errorState } from 'infrastructure/dataAccess/atoms'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'

interface ErrorFallbackProps extends FallbackProps {
  className?: string
}

const ErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
  const { error, resetErrorBoundary, className } = props
  const [, setError] = useAtom(errorState)

  useEffect(() => {
    setError(new Error(error.message))
  }, [error])

  const resetError = () => {
    resetErrorBoundary()
    setError(null)
  }

  return (
    <div className={className ? className : ''}>
      <p>
        <span role="img" aria-label="Warning icon">
          ⚠️
        </span>
        Unable to render area
      </p>
      <Button variant="contained" onClick={resetError}>
        Try again
      </Button>
    </div>
  )
}

export default ErrorFallback
