import { FetchOptions, ProfileResponse } from '@dmtool/application'
import { getJson } from 'infrastructure/dataAccess/http/fetch'

export interface ProfileRepositoryInterface {
  getProfile: (options?: FetchOptions) => Promise<ProfileResponse>
}

class ProfileRepository implements ProfileRepositoryInterface {
  async getProfile(options?: FetchOptions) {
    return await getJson<ProfileResponse>({ ...{ endpoint: '/profile' }, ...options })
  }
}

export default ProfileRepository
