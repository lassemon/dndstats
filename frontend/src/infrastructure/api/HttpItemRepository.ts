import {
  FetchOptions,
  HttpItemRepositoryInterface,
  ItemResponse,
  ItemSearchRequest,
  ItemSearchResponse,
  ItemUpdateResponse
} from '@dmtool/application'
import { Image, Item, Source } from '@dmtool/domain'
import { jsonToQueryString } from '@dmtool/infrastructure'
import { deleteJson, getJson, putJson } from 'infrastructure/dataAccess/http/fetch'
import _ from 'lodash'

export class HttpItemRepository implements HttpItemRepositoryInterface {
  async getAll(options: FetchOptions = {}): Promise<ItemSearchResponse> {
    return await getJson<ItemSearchResponse>({ ...{ endpoint: `/items` }, ...options })
  }

  async getAllForUser(userId: string, options: FetchOptions = {}): Promise<ItemResponse[]> {
    return await getJson<ItemResponse[]>({ ...{ endpoint: `/items/${userId}` }, ...options })
  }

  async search(query: ItemSearchRequest, options?: FetchOptions): Promise<ItemSearchResponse> {
    const {
      search,
      visibility,
      source,
      rarity,
      category,
      property,
      priceComparison,
      priceQuantity,
      priceUnit,
      weightComparison,
      weight,
      ...mandatoryParams
    } = query
    const cleanedUpQuery = {
      ...mandatoryParams,
      ...(!_.isEmpty(search) ? { search } : {}),
      ...(!_.isEmpty(visibility) ? { visibility } : {}),
      ...(!_.isEmpty(source) ? { source } : {}),
      ...(!_.isEmpty(rarity) ? { rarity } : {}),
      ...(!_.isEmpty(category) ? { category } : {}),
      ...(!_.isEmpty(property) ? { property } : {}),
      ...(priceQuantity ? { priceQuantity } : {}),
      ...(priceQuantity && priceComparison ? { priceComparison } : {}),
      ...(priceQuantity && priceUnit ? { priceUnit } : {}),
      ...(weight ? { weight } : {}),
      ...(weight && weightComparison ? { weightComparison } : {})
    }
    return await getJson<ItemSearchResponse>({ ...{ endpoint: jsonToQueryString('/items', cleanedUpQuery) }, ...options })
  }

  async getById(id: string, options: FetchOptions = {}): Promise<ItemResponse> {
    return await getJson<ItemResponse>({ ...{ endpoint: `/item/${id ? id : ''}` }, ...options })
  }

  async getByIdAndSource(id: string, source: `${Source}`, options: FetchOptions = {}): Promise<ItemResponse> {
    return await getJson<ItemResponse>({ ...{ endpoint: jsonToQueryString(`/item`, { id, source }) }, ...options })
  }

  async save(item: Item, image?: Image | null, options: FetchOptions = {}) {
    return await putJson<ItemUpdateResponse>({ ...{ endpoint: '/item', payload: { item, image } }, ...options })
  }

  async delete(itemId: string, options: FetchOptions = {}) {
    return await deleteJson<ItemResponse>({ ...{ endpoint: `/item/${itemId}` }, ...options })
  }
}
