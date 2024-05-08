import {
  FetchOptions,
  HttpItemRepositoryInterface,
  ItemDTO,
  ItemResponse,
  ItemSearchRequest,
  ItemSearchResponse
} from '@dmtool/application'
import { ApiError, Image, Item, Source } from '@dmtool/domain'
import { HttpItemRepository } from 'infrastructure/api/HttpItemRepository'
import { LocalStorageItemRepository } from 'infrastructure/repositories/LocalStorageItemRepository'
import { defaultItem } from 'services/defaults'
import { LocalStorageRepository } from './LocalStorageRepository'

export interface FrontendItemRepositoryInterface extends HttpItemRepositoryInterface {
  saveToLocalStorage(item: ItemResponse): Promise<ItemResponse>
}

const localStorageRepository = new LocalStorageRepository<ItemResponse>()
class ItemRepository implements FrontendItemRepositoryInterface {
  private backendRepository = new HttpItemRepository()
  private localStorageItemRepository = new LocalStorageItemRepository(localStorageRepository)

  async getAll(options: FetchOptions = {}): Promise<ItemSearchResponse> {
    return await this.backendRepository.getAll(options)
  }

  async getAllForUser(userId: string): Promise<ItemResponse[]> {
    return await this.backendRepository.getAllForUser(userId)
  }

  async search(query: ItemSearchRequest, options: FetchOptions = {}) {
    return await this.backendRepository.search(query, options)
  }

  async getById(id: string): Promise<ItemResponse> {
    try {
      // Attempt to fetch from the backend first
      const itemDTO = new ItemDTO(await this.backendRepository.getById(id))
      let localStorageItemDTO = {} as ItemDTO
      try {
        localStorageItemDTO = new ItemDTO(await this.localStorageItemRepository.getById())
      } catch (error) {
        // if localstorage is empty and backend item exists, we want to save item from backend to localstorage
        await this.localStorageItemRepository.save(itemDTO.toJSON())
      }

      if (itemDTO.isEqual(localStorageItemDTO)) {
        return itemDTO.toJSON()
      }

      const backendDataIsNewer =
        (itemDTO.updatedAt || itemDTO.createdAt) > (localStorageItemDTO?.updatedAt || localStorageItemDTO?.createdAt)
      if (backendDataIsNewer) {
        // Update localStorage with the latest item
        await this.localStorageItemRepository.save(itemDTO.toJSON())
      }

      return itemDTO.toJSON()
    } catch (error) {
      // If the backend fetch fails, attempt to retrieve from localStorage
      console.error(error)
      try {
        return await this.localStorageItemRepository.getById()
      } catch (error) {
        console.error(error)
        return defaultItem
      }
    }
  }

  async getByIdAndSource(id: string, source: `${Source.FifthESRD}`): Promise<ItemResponse> {
    try {
      // Attempt to fetch from the backend first
      const itemDTO = new ItemDTO(await this.backendRepository.getByIdAndSource(id, source))
      let localStorageItemDTO = {} as ItemDTO
      try {
        localStorageItemDTO = new ItemDTO(await this.localStorageItemRepository.getById())
      } catch (error) {
        // if localstorage is empty and backend item exists, we want to save item from backend to localstorage
        await this.localStorageItemRepository.save(itemDTO.toJSON())
      }

      if (itemDTO.isEqual(localStorageItemDTO)) {
        return itemDTO.toJSON()
      }

      const backendDataIsNewer =
        (itemDTO.updatedAt || itemDTO.createdAt) > (localStorageItemDTO?.updatedAt || localStorageItemDTO?.createdAt)
      if (backendDataIsNewer) {
        // Update localStorage with the latest item
        await this.localStorageItemRepository.save(itemDTO.toJSON())
      }

      return itemDTO.toJSON()
    } catch (error) {
      // If the backend fetch fails, attempt to retrieve from localStorage
      console.error(error)
      try {
        const localStorageItem = await this.localStorageItemRepository.getById()
        if (localStorageItem.id === id) {
          return localStorageItem
        }
        throw new ApiError(404, 'NotFound')
      } catch (error) {
        console.error(error)
        return defaultItem
      }
    }
  }

  async save(item: Item, image?: Image | null) {
    const persistedItem = await this.backendRepository.save(item, image)
    await this.localStorageItemRepository.save(persistedItem.item)
    return persistedItem
  }

  async saveToLocalStorage(item: ItemResponse) {
    await this.localStorageItemRepository.save(item)
    return item
  }

  async delete(itemId: string) {
    await this.localStorageItemRepository.delete(itemId)
    return await this.backendRepository.delete(itemId)
  }
}

export default ItemRepository
