import _ from 'lodash'
import { DateTime } from 'luxon'

export const load = async <T extends unknown>(key: string): Promise<T> => {
  const storedItem = JSON.parse(localStorage.getItem(key) || '{}')
  return await Promise.resolve(!_.isEmpty(storedItem) ? storedItem : null)
  //return await new Promise((resolve) => setTimeout(resolve, 2500, !_.isEmpty(storedItem) ? storedItem : null))
}

export const store = async (key: string, data: any) => {
  return await Promise.resolve(localStorage.setItem(key, JSON.stringify({ ...data, updated: DateTime.now().toUnixInteger() })))
  //return await new Promise((resolve) => setTimeout(resolve, 1500, localStorage.setItem(key, JSON.stringify(data))))
  //await new Promise((resolve, reject) => setTimeout(reject, 1500, new StorageSyncError('VIRHEEE')))
}

export const clear = async (key: string) => {
  return await new Promise<void>((resolve) => {
    localStorage.removeItem(key)
    resolve()
  })
}

export const clearAll = async () => {
  return await Promise.resolve(localStorage.clear())
}
