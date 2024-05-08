import { ItemResponse, LocalStorageItemRepositoryInterface, LocalStorageRepositoryInterface } from '@dmtool/application'

export const ITEM_STATE_NAME = 'itemState'

export class LocalStorageItemRepository implements LocalStorageItemRepositoryInterface {
  constructor(private readonly localStorageRepository: LocalStorageRepositoryInterface<ItemResponse>) {}

  async getById(key?: string): Promise<ItemResponse> {
    const itemJSON = await this.localStorageRepository.getById(ITEM_STATE_NAME)
    if (!itemJSON) {
      throw new Error(`${ITEM_STATE_NAME} localStorage is empty.`)
    }
    return Promise.resolve(itemJSON) // Wrapping in Promise to conform to the async interface
  }

  async save(item: ItemResponse) {
    return await this.localStorageRepository.save(item, ITEM_STATE_NAME)
  }

  async delete(id: string) {
    return await this.localStorageRepository.delete(id)
  }
}
