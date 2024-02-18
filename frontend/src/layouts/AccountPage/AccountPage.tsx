import { Button, Divider, TextField, Typography } from '@mui/material'
import useDefaultPage from 'hooks/useDefaultPage'
import { authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import UserRepository from 'infrastructure/repositories/UserRepository'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { dateStringFromUnixTime, unixtimeNow } from 'utils/utils'
import _ from 'lodash'
import { LoadingButton } from '@mui/lab'
import SendIcon from '@mui/icons-material/Send'

const useStyles = makeStyles()(() => ({
  root: {
    margin: '2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5em',
    '& > .MuiTextField-root': {
      width: 'inherit'
    }
  },
  dateContainer: {
    display: 'flex',
    gap: '0.2em',
    flexDirection: 'column',
    '& > .MuiTypography-root': {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1em'
    }
  }
}))

const userRepository = new UserRepository()

const AccountPage: React.FC = () => {
  const [authState, setAuthState] = useAtom(authAtom)
  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const [user, setUser] = useState(authState.user)
  const [changePassword, setChangePassword] = useState({ oldPassword: '', newPassword: '', newPasswordConfirmation: '', error: false, oldPasswordError: false })
  const { classes } = useStyles()
  useDefaultPage(!authState.loggedIn)

  const [userChanged, setUserChanged] = useState(JSON.stringify(user) !== JSON.stringify(authState.user))
  const [saveFailed, setSaveFailed] = useState(userChanged)
  const passwordChanged = changePassword.newPassword !== '' || changePassword.newPasswordConfirmation !== ''

  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false)
  const [loadingUserUpdate, setLoadingUserUpdate] = useState(false)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
  const [loadingPasswordChange, setLoadingPasswordChange] = useState(false)

  const resetUiIndicators = () => {
    setSaveFailed(false)
    setLoadingPasswordChange(false)
    setLoadingUserUpdate(false)
    setPasswordChangeSuccess(false)
    setUserUpdateSuccess(false)
  }

  useEffect(() => {
    setUserChanged(JSON.stringify(user) !== JSON.stringify(authState.user))
  }, [user, authState.user])

  useEffect(() => {
    setUser(authState.user)
  }, [authState.user])

  useEffect(() => {
    const fetchAndSetUser = async () => {
      if (authState.user)
        try {
          const fetchedUser = await userRepository.getById(authState.user?.id)
          setAuthState((_authState) => {
            return {
              ..._authState,
              user: fetchedUser
            }
          })
        } catch (error) {
          console.error('Failed to fetch user:', error)
        }
    }

    if (authState.loggedIn) {
      fetchAndSetUser()
    }
  }, [])

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resetUiIndicators()
    setUser((_user) => {
      if (_user) {
        return { ..._user, name: event.target.value, updatedAt: unixtimeNow() }
      }
    })
  }

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resetUiIndicators()
    setChangePassword((_changePassword) => {
      return { ..._changePassword, error: false }
    })
    setUser((_user) => {
      if (_user) {
        return { ..._user, email: event.target.value, updatedAt: unixtimeNow() }
      }
    })
  }

  const onUpdateUser = () => {
    if (user) {
      resetUiIndicators()
      setLoadingUserUpdate(true)
      setError(null)
      const userUpdate = {
        ..._.omit(user, 'id', 'roles', 'createdAt', 'updatedAt')
      }
      userRepository
        .update(userUpdate)
        .then((persistedUser) => {
          setAuthState((_authState) => {
            const newAuthState = {
              ..._authState,
              user: persistedUser
            }
            return newAuthState
          })
          setSaveFailed(false)
          setUserUpdateSuccess(true)
        })
        .catch((error) => {
          setSaveFailed(true)
          setError(error)
        })
        .finally(() => {
          setLoadingUserUpdate(false)
        })
    }
  }

  const onChangePassword = () => {
    if (user && validatePasswordChange()) {
      resetUiIndicators()
      setLoadingPasswordChange(true)
      setError(null)
      setChangePassword((_changePassword) => {
        return { ..._changePassword, newPassword: '', newPasswordConfirmation: '', oldPassword: '' }
      })
      const passwordUpdate = {
        oldPassword: changePassword.oldPassword,
        newPassword: changePassword.newPassword
      }
      userRepository
        .update(passwordUpdate)
        .then(() => {
          setPasswordChangeSuccess(true)
        })
        .catch((error) => {
          if (error.status === 401) {
            setChangePassword((_changePassword) => {
              return { ..._changePassword, oldPasswordError: true }
            })
          }
          setError(error)
        })
        .finally(() => {
          setLoadingPasswordChange(false)
        })
    }
  }

  const validatePasswordChange = () => {
    const oldPasswordEmpty = changePassword.oldPassword === ''
    if (oldPasswordEmpty) {
      setChangePassword((_changePassword) => {
        return { ..._changePassword, oldPasswordError: true }
      })
      return
    }
    if (changePassword.newPassword) {
      const passwordMatchesConfirmation = changePassword.newPassword === changePassword.newPasswordConfirmation
      if (!passwordMatchesConfirmation) {
        setChangePassword((_changePassword) => {
          return { ..._changePassword, error: true }
        })
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  const onChangeOldPasswordField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resetUiIndicators()
    setChangePassword((_changePassword) => {
      return { ..._changePassword, oldPasswordError: false }
    })
    setChangePassword((_changePassword) => {
      return {
        ..._changePassword,
        oldPassword: event.target.value
      }
    })
  }

  const onChangeNewPasswordField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resetUiIndicators()
    setChangePassword((_changePassword) => {
      return { ..._changePassword, error: false }
    })
    setChangePassword((_changePassword) => {
      return {
        ..._changePassword,
        newPassword: event.target.value
      }
    })
  }

  const onChangeNewPasswordConfirmationField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resetUiIndicators()
    setChangePassword((_changePassword) => {
      return { ..._changePassword, error: false }
    })
    setChangePassword((_changePassword) => {
      return {
        ..._changePassword,
        newPasswordConfirmation: event.target.value
      }
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className={classes.root}>
      <Typography variant="body2" color={(theme) => theme.palette.primary.dark}>
        id {`{ ${user.id} }`}
      </Typography>

      <TextField
        id={'name'}
        value={user.name}
        label={'Name'}
        onChange={onChangeName}
        variant="filled"
        InputLabelProps={{
          shrink: true
        }}
        sx={{}}
      />

      <TextField
        id={'email'}
        value={user.email}
        label={'Email'}
        onChange={onChangeEmail}
        variant="filled"
        InputLabelProps={{
          shrink: true
        }}
        sx={{}}
      />

      <div>
        <LoadingButton
          onClick={onUpdateUser}
          endIcon={<SendIcon />}
          loading={loadingUserUpdate}
          disabled={!userChanged && !saveFailed}
          loadingPosition="end"
          variant="contained"
        >
          <span>Update Account</span>
        </LoadingButton>
        {userUpdateSuccess && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              margin: '0 0 0 3em',
              color: (theme) => theme.palette.success.main
            }}
          >
            Account updated succesfully.
          </Typography>
        )}
      </div>

      <Divider sx={{ width: '100%', borderBottomWidth: 'medium' }} />

      <TextField
        id={'old-password'}
        value={changePassword.oldPassword}
        type="password"
        label={'Old password'}
        onChange={onChangeOldPasswordField}
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true
        }}
        error={changePassword.oldPasswordError}
        sx={{
          margin: '0 0 .5em .5em'
        }}
      />
      <TextField
        id={'new-password'}
        value={changePassword.newPassword}
        label={'New password'}
        onChange={onChangeNewPasswordField}
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true
        }}
        error={changePassword.error}
        sx={{
          margin: '0 0 0 1em'
        }}
      />
      <TextField
        id={'new-password-confirmation'}
        value={changePassword.newPasswordConfirmation}
        label={'Confirm password'}
        onChange={onChangeNewPasswordConfirmationField}
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true
        }}
        error={changePassword.error}
        sx={{
          margin: '0 0 0 1em'
        }}
      />

      <div>
        <LoadingButton
          onClick={onChangePassword}
          endIcon={<SendIcon />}
          loading={loadingPasswordChange}
          disabled={!passwordChanged}
          loadingPosition="end"
          variant="contained"
          sx={{
            margin: '0 0 0 7em'
          }}
        >
          <span>Change Password</span>
        </LoadingButton>
        {passwordChangeSuccess && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              margin: '0 0 0 11em',
              color: (theme) => theme.palette.success.main
            }}
          >
            Password changed succesfully.
          </Typography>
        )}
      </div>

      <Divider sx={{ width: '100%', borderBottomWidth: 'medium' }} />

      <div className={classes.dateContainer}>
        {authState.user?.createdAt && (
          <Typography variant="body2" color={(theme) => theme.palette.grey[700]}>
            <span>Account created:</span> <span>{`{ ${dateStringFromUnixTime(authState.user.createdAt)} }`}</span>
          </Typography>
        )}
        {authState.user?.updatedAt && (
          <Typography variant="body2" color={(theme) => theme.palette.grey[700]}>
            <span>Account last updated:</span> <span>{`{ ${dateStringFromUnixTime(authState.user.updatedAt)} }`}</span>
          </Typography>
        )}
      </div>
    </div>
  )
}

export default AccountPage
