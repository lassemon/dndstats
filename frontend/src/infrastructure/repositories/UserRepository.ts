import { FetchOptions, HttpUserRepositoryInterface, UserInsertRequest, UserResponse, UserUpdateRequest } from '@dmtool/application'
import { ApiError } from '@dmtool/domain'
import { getJson, postJson, putJson } from 'infrastructure/dataAccess/http/fetch'

class UserRepository implements HttpUserRepositoryInterface {
  async getAll(options?: FetchOptions): Promise<UserResponse[]> {
    throw new ApiError(501, 'NotImplemented')
  }

  async getById(userId: string, options?: FetchOptions): Promise<UserResponse> {
    return await getJson<UserResponse>({ ...{ endpoint: `/user/${userId ? userId : ''}` }, ...options })
  }

  async count(options?: FetchOptions): Promise<number> {
    throw new ApiError(501, 'NotImplemented')
  }

  async create(user: UserInsertRequest, options?: FetchOptions) {
    return await postJson<UserResponse>({ ...{ endpoint: '/user', payload: user }, ...options })
  }

  async update(user: UserUpdateRequest, options?: FetchOptions) {
    return await putJson<UserResponse>({ ...{ endpoint: '/user', payload: user }, ...options })
  }

  async deactivate(userId: string, options?: FetchOptions) {
    throw new ApiError(501, 'NotImplemented')
  }
}

export default UserRepository
