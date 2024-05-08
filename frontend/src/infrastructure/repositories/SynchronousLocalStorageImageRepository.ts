import { LocalStorageImageRepositoryInterface } from '@dmtool/application'
import { Image } from '@dmtool/domain'
import { SynchronousLocalStorageRepository } from './SynchronousLocalStorageRepository'

export const IMAGE_STATE_NAME = 'imageState'

export class SynchronousLocalStorageImageRepository implements LocalStorageImageRepositoryInterface {
  constructor(private readonly localStorageRepository: SynchronousLocalStorageRepository<Image>) {}

  getById(id: string): Image {
    const imageJSON = this.localStorageRepository.getById(IMAGE_STATE_NAME)
    if (!imageJSON) {
      throw new Error(`${IMAGE_STATE_NAME} localStorage is empty.`)
    }
    return imageJSON
  }

  save(image: Image) {
    return this.localStorageRepository.save(image, IMAGE_STATE_NAME)
  }

  delete(id: string) {
    return this.localStorageRepository.delete(id)
  }
}
