import { LocalStorageRepositoryInterface } from '@dmtool/application'
import _ from 'lodash'
import { unixtimeNow } from 'utils/utils'

export class LocalStorageRepository<T> implements LocalStorageRepositoryInterface<T> {
  async getById(key: string): Promise<T> {
    const storedItem = JSON.parse(localStorage.getItem(key) || '{}')
    return await Promise.resolve(!_.isEmpty(storedItem) ? storedItem : null)
    //return await new Promise((resolve) => setTimeout(resolve, 2500, !_.isEmpty(storedItem) ? storedItem : null))
  }

  async save(data: T, key: string) {
    localStorage.setItem(key, JSON.stringify({ ...data, updatedAt: unixtimeNow() }))
    return await Promise.resolve(JSON.parse(localStorage.getItem(key) || '{}'))
    //return await new Promise<T>((resolve) => setTimeout(resolve, 1500, localStorage.setItem(key, JSON.stringify(data))))
    //await new Promise((resolve, reject) => setTimeout(reject, 1500, new StorageSyncError('VIRHEEE')))
  }

  async delete(key: string) {
    const entity: T = JSON.parse(localStorage.getItem(key) || '{}')
    localStorage.removeItem(key)
    return await Promise.resolve(entity)
  }

  async clearAll() {
    return await Promise.resolve(localStorage.clear())
  }
}
