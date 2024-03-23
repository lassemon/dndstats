import {
  FetchOptions,
  HttpItemRepositoryInterface,
  ItemResponse,
  ItemSearchRequest,
  ItemSearchResponse,
  ItemUpdateResponse
} from '@dmtool/application'
import { Image, Item } from '@dmtool/domain'
import { deleteJson, getJson, jsonToQueryString, putJson } from 'infrastructure/dataAccess/http/fetch'
import _ from 'lodash'

export class HttpItemRepository implements HttpItemRepositoryInterface {
  async getAll(options: FetchOptions = {}): Promise<ItemSearchResponse> {
    return await getJson<ItemSearchResponse>({ ...{ endpoint: `/items` }, ...options })
  }

  async getAllForUser(userId: string, options: FetchOptions = {}): Promise<ItemResponse[]> {
    return await getJson<ItemResponse[]>({ ...{ endpoint: `/items/${userId}` }, ...options })
  }

  async search(query: ItemSearchRequest, options?: FetchOptions): Promise<ItemSearchResponse> {
    const { visibility, rarity, priceComparison, priceQuantity, priceUnit, weightComparison, weight, ...mandatoryParams } = query
    const cleanedUpQuery = {
      ...mandatoryParams,
      ...(!_.isEmpty(visibility) ? { visibility: visibility } : {}),
      ...(!_.isEmpty(rarity) ? { rarity: rarity } : {}),
      ...(priceQuantity ? { priceQuantity: priceQuantity } : {}),
      ...(priceQuantity && priceComparison ? { priceComparison: priceComparison } : {}),
      ...(priceQuantity && priceUnit ? { priceUnit: priceUnit } : {}),
      ...(weight ? { weight: weight } : {}),
      ...(weight && weightComparison ? { weightComparison: weightComparison } : {})
    }
    return await getJson<ItemSearchResponse>({ ...{ endpoint: jsonToQueryString('/items', cleanedUpQuery) }, ...options })
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
