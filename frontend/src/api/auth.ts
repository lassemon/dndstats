import { get, post } from 'utils/fetch'

export interface IUserResponse {
  id: number
  name: string
  email: string
  created: Date
}

export const login = async (loginPayload: { username: string; password: string }) => {
  return await post<IUserResponse>({ endpoint: '/auth/login', payload: loginPayload, noRefresh: true })
}

export const logout = async () => {
  return await post({ endpoint: '/auth/logout' })
}

export const refreshToken = async () => {
  return await post({ endpoint: 'auth/refresh' })
}

export const status = async () => {
  return get({ endpoint: '/auth/status' })
}
