import { LocalStorageRepositoryInterface } from '@dmtool/application'
import { unixtimeNow } from '@dmtool/common'

import _ from 'lodash'

export const ITEM_STATE_NAME = 'itemState'

export class SynchronousLocalStorageRepository<T> implements LocalStorageRepositoryInterface<T> {
  getById(key: string): T {
    const storedItem = JSON.parse(localStorage.getItem(key) || '{}')
    return !_.isEmpty(storedItem) ? storedItem : null
    //return await new Promise((resolve) => setTimeout(resolve, 2500, !_.isEmpty(storedItem) ? storedItem : null))
  }

  save(data: T, key: string) {
    localStorage.setItem(key, JSON.stringify({ ...data, updatedAt: unixtimeNow() }))
    return JSON.parse(localStorage.getItem(key) || '{}')
    //return await new Promise<T>((resolve) => setTimeout(resolve, 1500, localStorage.setItem(key, JSON.stringify(data))))
    //await new Promise((resolve, reject) => setTimeout(reject, 1500, new StorageSyncError('VIRHEEE')))
  }

  delete(key: string) {
    const entity: T = JSON.parse(localStorage.getItem(key) || '{}')
    localStorage.removeItem(key)
    return entity
  }
}
