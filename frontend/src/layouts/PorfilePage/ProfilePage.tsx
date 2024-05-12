import { Divider, SnackbarContent, Stack, Typography } from '@mui/material'
import useDefaultPage from 'hooks/useDefaultPage'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import UserRepository from 'infrastructure/repositories/UserRepository'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import _ from 'lodash'
import ProfileStat from 'components/ProfileStat'
import ProfileRepository from 'infrastructure/repositories/ProfileRepository'
import { ProfileResponse } from '@dmtool/application'
import PageHeader from 'components/PageHeader'
import { dateStringFromUnixTime } from '@dmtool/common'

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
  rolesContainer: {},
  statsContainer: {
    display: 'flex',
    margin: '3em 0 1em 2em'
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
const profileRepository = new ProfileRepository()

const ProfilePage: React.FC = () => {
  const [authState, setAuthState] = useAtom(authAtom)
  const [user] = useState(authState.user)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const { classes } = useStyles()
  useDefaultPage(!authState.loggedIn)

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

    const fetchAndSetProfile = async () => {
      if (authState.user) {
        try {
          setLoadingProfile(true)
          const profileResponse = await profileRepository.getProfile().finally(() => {
            setLoadingProfile(false)
          })
          setProfile(profileResponse)
        } catch (error) {
          console.error('Failed to fetch profile', error)
        }
      }
    }

    if (authState.loggedIn) {
      fetchAndSetUser()
      fetchAndSetProfile()
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="body2" color={(theme) => theme.palette.primary.dark}>
          id {`{ ${user.id} }`}
        </Typography>
        <PageHeader>
          {user.name}
          <Typography variant="body2" sx={{ textAlign: 'right', margin: '-8px -20px 0 0', textTransform: 'initial' }} color="secondary">
            {user.email}
          </Typography>
        </PageHeader>
      </div>

      {!_.isEmpty(authState.user?.roles) && (
        <div className={classes.rolesContainer}>
          <Typography variant="h6" color="secondary" sx={{ fontWeight: 'bold', opacity: '0.7' }}>
            Roles
          </Typography>
          {authState.user?.roles.map((role, index) => (
            <Stack spacing={2} sx={{ maxWidth: 600, margin: '0.5em 0 0 2em' }} key={index}>
              <SnackbarContent
                message={role}
                elevation={0}
                variant="outlined"
                sx={{
                  background: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.secondary.main,
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  fontFamily: 'inherit'
                }}
              />
            </Stack>
          ))}
        </div>
      )}

      <div className={classes.statsContainer}>
        <ProfileStat title="Items created" loading={loadingProfile} amount={profile?.itemsCreated || 0} />
        <ProfileStat title="Spells created" loading={loadingProfile} amount={profile?.spellsCreated || 0} style={{ opacity: '0.4' }} />
        <ProfileStat title="Monsters created" loading={loadingProfile} amount={profile?.monstersCreated || 0} style={{ opacity: '0.4' }} />
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

export default ProfilePage
