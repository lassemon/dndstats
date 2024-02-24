import { FetchOptions, HttpItemRepositoryInterface, ItemDTO } from '@dmtool/application'
import { Image, Item } from '@dmtool/domain'
import { HttpItemRepository } from 'infrastructure/api/HttpItemRepository'
import { LocalStorageItemRepository } from 'infrastructure/repositories/LocalStorageItemRepository'
import { defaultItem } from 'services/defaults'
import { LocalStorageRepository } from './LocalStorageRepository'

export interface FrontendItemRepositoryInterface extends HttpItemRepositoryInterface {
  saveToLocalStorage(item: Item): Promise<Item>
}

const localStorageRepository = new LocalStorageRepository<Item>()
class ItemRepository implements FrontendItemRepositoryInterface {
  private backendRepository = new HttpItemRepository()
  private localStorageRepository = new LocalStorageItemRepository(localStorageRepository)

  async getAll(options: FetchOptions = {}): Promise<Item[]> {
    return await this.backendRepository.getAll(options)
  }

  async getAllForUser(userId: string): Promise<Item[]> {
    return await this.backendRepository.getAllForUser(userId)
  }

  async getById(id: string): Promise<Item> {
    try {
      // Attempt to fetch from the backend first
      const itemDTO = new ItemDTO(await this.backendRepository.getById(id))
      let localStorageItemDTO = {} as ItemDTO
      try {
        localStorageItemDTO = new ItemDTO(await this.localStorageRepository.getById(id))
      } catch (error) {
        // if localstorage is empty and backend item exists, we want to save item from backend to localstorage
        await this.localStorageRepository.save(itemDTO.toJSON())
      }

      if (itemDTO.isEqual(localStorageItemDTO)) {
        return itemDTO.toJSON()
      }

      const backendDataIsNewer =
        (itemDTO.updatedAt || itemDTO.createdAt) > (localStorageItemDTO?.updatedAt || localStorageItemDTO?.createdAt)
      if (backendDataIsNewer) {
        // Update localStorage with the latest item
        await this.localStorageRepository.save(itemDTO.toJSON())
      }

      return itemDTO.toJSON()
    } catch (error) {
      // If the backend fetch fails, attempt to retrieve from localStorage
      console.error(error)
      try {
        return await this.localStorageRepository.getById(id)
      } catch (error) {
        console.error(error)
        return defaultItem
      }
    }
  }

  async save(item: Item, image?: Image | null) {
    const persistedItem = await this.backendRepository.save(item, image)
    await this.localStorageRepository.save(persistedItem.item)
    return persistedItem
  }

  async saveToLocalStorage(item: Item) {
    await this.localStorageRepository.save(item)
    return item
  }

  async delete(itemId: string) {
    await this.localStorageRepository.delete(itemId)
    return await this.backendRepository.delete(itemId)
  }
}

export default ItemRepository
