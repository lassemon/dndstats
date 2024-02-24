import { LocalStorageImageRepositoryInterface } from '@dmtool/application'
import { Image } from '@dmtool/domain'
import { SynchronousLocalStorageRepository } from './SynchronousLocalStorageRepository'

export const IMAGE_STATE_NAME = 'imageState'

export class SynchronousLocalStorageImageRepository implements LocalStorageImageRepositoryInterface {
  constructor(private readonly localStorageRepository: SynchronousLocalStorageRepository<Image>) {}

  getById(id: string): Image {
    console.log('trying to get image from local storage', id)

    const imageJSON = this.localStorageRepository.getById(IMAGE_STATE_NAME)
    console.log('found image from local', imageJSON)
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
