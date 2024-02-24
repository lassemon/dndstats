import { LocalStorageImageRepositoryInterface, LocalStorageRepositoryInterface } from '@dmtool/application'
import { Image } from '@dmtool/domain'

export const IMAGE_STATE_NAME = 'imageState'

export class LocalStorageImageRepository implements LocalStorageImageRepositoryInterface {
  constructor(private readonly localStorageRepository: LocalStorageRepositoryInterface<Image>) {}

  async getById(id: string): Promise<Image> {
    const imageJSON = await this.localStorageRepository.getById(IMAGE_STATE_NAME)
    if (!imageJSON) {
      throw new Error(`${IMAGE_STATE_NAME} localStorage is empty.`)
    }
    return Promise.resolve(imageJSON) // Wrapping in Promise to conform to the async interface
  }

  async save(image: Image) {
    return await this.localStorageRepository.save(image, IMAGE_STATE_NAME)
  }

  async delete(id: string) {
    return await this.localStorageRepository.delete(id)
  }
}
