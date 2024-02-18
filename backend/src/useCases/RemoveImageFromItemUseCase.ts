import {
  DatabaseImageRepositoryInterface,
  DatabaseItemRepositoryInterface,
  ITEM_DEFAULTS,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'
import { Item, User } from '@dmtool/domain'
import { ImageStorageServiceInterface } from '@dmtool/infrastructure'
import ApiError from '/domain/errors/ApiError'
import { Logger } from '@dmtool/common'

const logger = new Logger('RemoveImageFromItemUseCase')

export interface RemoveImageFromItemUseCaseOptions extends UseCaseOptionsInterface {
  item: Item
  user: User
}

export type RemoveImageFromItemUseCaseInterface = UseCaseInterface<RemoveImageFromItemUseCaseOptions, Item>

export class RemoveImageFromItemUseCase implements RemoveImageFromItemUseCaseInterface {
  constructor(
    private readonly itemRepository: DatabaseItemRepositoryInterface,
    private readonly imageStorageService: ImageStorageServiceInterface,
    private readonly imageRepository: DatabaseImageRepositoryInterface
  ) {}

  async execute({ item, user }: RemoveImageFromItemUseCaseOptions) {
    try {
      const savedItem = await this.itemRepository.getById(item.id)

      if (savedItem.imageId === ITEM_DEFAULTS.DEFAULT_ITEM_IMAGE_ID) {
        return savedItem
      }
      if (savedItem.imageId) {
        const savedImage = await this.imageRepository.getById(savedItem.imageId)
        await this.imageStorageService.removeImageFromFileSystem(savedImage.metadata.fileName)
        await this.imageRepository.delete(savedImage.metadata.id)
      }
      return await this.itemRepository.save({ ...savedItem, imageId: null }, user.id)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        logger.debug('Attempted to remove image from non existing item', item.id)
      } else {
        throw error
      }
      return item
    }
  }
}
