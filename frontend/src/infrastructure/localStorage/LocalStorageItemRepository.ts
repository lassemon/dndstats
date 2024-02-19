import { HttpItemRepositoryInterface } from '@dmtool/application'
import { clear, load, store } from './LocalStorage'
import { Item } from '@dmtool/domain'

const ITEM_STATE_NAME = 'itemState'

interface LocalStorageItemRepositoryInterface extends Omit<HttpItemRepositoryInterface, 'save' | 'getAll' | 'getAllForUser'> {
  save(item: Item): Promise<Item>
}

export class LocalStorageItemRepository implements LocalStorageItemRepositoryInterface {
  async getById(id: string): Promise<Item> {
    const itemJSON = await load<Item>(ITEM_STATE_NAME)
    if (!itemJSON) {
      throw new Error(`${ITEM_STATE_NAME} localStorage is empty.`)
    }
    return Promise.resolve(itemJSON) // Wrapping in Promise to conform to the async interface
  }

  async save(item: Item) {
    await store(ITEM_STATE_NAME, item)
    return item
  }
  async delete(itemId: string) {
    const itemJSON = await load<Item>(ITEM_STATE_NAME)
    await clear(ITEM_STATE_NAME)
    return itemJSON
  }
}
