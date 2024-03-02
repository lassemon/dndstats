import { UserResponse } from '@dmtool/application'
import { getJson, postJson } from 'infrastructure/dataAccess/http/fetch'

export const login = async (loginPayload: { username: string; password: string }) => {
  return await postJson<UserResponse>({ endpoint: '/auth/login', payload: loginPayload, noRefresh: true })
}

export const logout = async () => {
  return await postJson({ endpoint: '/auth/logout' })
}

export const status = async () => {
  return getJson({ endpoint: '/auth/status' })
}
