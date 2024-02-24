import { LocalStorageItemRepositoryInterface } from '@dmtool/application'
import { Item } from '@dmtool/domain'
import { SynchronousLocalStorageRepository } from './SynchronousLocalStorageRepository'

export const ITEM_STATE_NAME = 'itemState'

export class SynchronousLocalStorageItemRepository implements LocalStorageItemRepositoryInterface {
  constructor(private readonly localStorageRepository: SynchronousLocalStorageRepository<Item>) {}

  getById(id: string): Item {
    const itemJSON = this.localStorageRepository.getById(ITEM_STATE_NAME)
    if (!itemJSON) {
      throw new Error(`${ITEM_STATE_NAME} localStorage is empty.`)
    }
    return itemJSON
  }

  save(item: Item) {
    this.localStorageRepository.save(item, ITEM_STATE_NAME)
    return this.getById(item.id)
  }

  delete(itemId: string) {
    return this.localStorageRepository.delete(ITEM_STATE_NAME)
  }
}
