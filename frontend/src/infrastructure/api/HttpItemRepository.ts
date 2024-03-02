import { FetchOptions, HttpItemRepositoryInterface, ItemResponse, ItemUpdateRequest, ItemUpdateResponse } from '@dmtool/application'
import { Image, Item } from '@dmtool/domain'
import { deleteJson, getJson, putJson } from 'infrastructure/dataAccess/http/fetch'

export class HttpItemRepository implements HttpItemRepositoryInterface {
  async getAll(options: FetchOptions = {}): Promise<ItemResponse[]> {
    return await getJson<ItemResponse[]>({ ...{ endpoint: `/items/` }, ...options })
  }

  async getAllForUser(userId: string, options: FetchOptions = {}): Promise<ItemResponse[]> {
    return await getJson<ItemResponse[]>({ ...{ endpoint: `/items/${userId}` }, ...options })
  }

  async getById(id: string, options: FetchOptions = {}): Promise<ItemResponse> {
    return await getJson<ItemResponse>({ ...{ endpoint: `/item/${id ? id : ''}` }, ...options })
  }

  async save(item: Item, image?: Image | null, options: FetchOptions = {}) {
    return await putJson<ItemUpdateResponse>({ ...{ endpoint: '/item', payload: { item, image } }, ...options })
  }

  async delete(itemId: string, options: FetchOptions = {}) {
    return await deleteJson<ItemResponse>({ ...{ endpoint: `/item/${itemId}` }, ...options })
  }
}
