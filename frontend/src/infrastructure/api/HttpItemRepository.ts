import { FetchOptions, HttpItemRepositoryInterface, ItemUpdateResponse } from '@dmtool/application'
import { Image, Item } from '@dmtool/domain'
import { deleteJson, getJson, putJson } from 'infrastructure/dataAccess/http/fetch'

export class HttpItemRepository implements HttpItemRepositoryInterface {
  async getAll(options: FetchOptions = {}): Promise<Item[]> {
    return await getJson<Item[]>({ ...{ endpoint: `/items/` }, ...options })
  }

  async getAllForUser(userId: string, options: FetchOptions = {}): Promise<Item[]> {
    return await getJson<Item[]>({ ...{ endpoint: `/items/${userId}` }, ...options })
  }

  async getById(id: string, options: FetchOptions = {}): Promise<Item> {
    return await getJson<Item>({ ...{ endpoint: `/item/${id ? id : ''}` }, ...options })
  }

  async save(item: Item, image?: Image | null, options: FetchOptions = {}) {
    return await putJson<ItemUpdateResponse>({ ...{ endpoint: '/item', payload: { item, image } }, ...options })
  }

  async delete(itemId: string, options: FetchOptions = {}) {
    return await deleteJson<Item>({ ...{ endpoint: `/item/${itemId}` }, ...options })
  }
}
