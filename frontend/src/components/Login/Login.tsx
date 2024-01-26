import { Button } from '@mui/material'
import React, { useState } from 'react'

import LoginDialog from 'components/LoginDialog'
import { useAtom } from 'jotai'
import { authState } from 'infrastructure/dataAccess/atoms'
import { IUserResponse, logout, status } from 'api/auth'
import { scheduleAsyncFunction } from 'utils/utils'

const Login: React.FC = () => {
  const [auth, setAuthState] = useAtom(authState)
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false)

  const openLoginDialog = () => {
    setLoginDialogOpen(true)
  }

  const closeLoginDialog = () => {
    setLoginDialogOpen(false)
  }

  const handleLoginSuccess = (successResponse: IUserResponse) => {
    setAuthState((_authState) => {
      return {
        ..._authState,
        loggedIn: true,
        user: successResponse
      }
    })
    setLoginDialogOpen(false)
    if (auth?.loggedIn) {
      // calling status every 10 seconds ensures that if the jwt token expires, the refreshToken
      // functionality should recreate the token. This should ensure the user staying
      // logged in as long as the browser tab remains active
      scheduleAsyncFunction(status, 1000, auth.loggedIn)
    }
  }

  const onLogout = () => {
    logout().finally(() => {
      setAuthState(() => {
        return {
          loggedIn: false,
          user: undefined
        }
      })
    })
  }

  return (
    <>
      {!auth?.loggedIn ? (
        <Button variant="contained" onClick={openLoginDialog}>
          Login
        </Button>
      ) : (
        <Button variant="contained" onClick={onLogout}>
          Logout {auth.user?.name}
        </Button>
      )}
      <LoginDialog open={isLoginDialogOpen} onClose={closeLoginDialog} onLoginSuccess={handleLoginSuccess} />
    </>
  )
}

export default Login
