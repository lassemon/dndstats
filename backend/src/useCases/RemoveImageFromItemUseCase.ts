import {
  DatabaseImageRepositoryInterface,
  DatabaseItemRepositoryInterface,
  ITEM_DEFAULTS,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'
import { ApiError, Item } from '@dmtool/domain'
import { ImageStorageServiceInterface } from '@dmtool/infrastructure'
import { Logger } from '@dmtool/common'

const logger = new Logger('RemoveImageFromItemUseCase')

export interface RemoveImageFromItemUseCaseOptions extends UseCaseOptionsInterface {
  itemId: string
  userId: string
}

export type RemoveImageFromItemUseCaseInterface = UseCaseInterface<RemoveImageFromItemUseCaseOptions, Item | null>

export class RemoveImageFromItemUseCase implements RemoveImageFromItemUseCaseInterface {
  constructor(
    private readonly itemRepository: DatabaseItemRepositoryInterface,
    private readonly imageStorageService: ImageStorageServiceInterface,
    private readonly imageRepository: DatabaseImageRepositoryInterface
  ) {}

  async execute({ itemId, userId }: RemoveImageFromItemUseCaseOptions) {
    try {
      const existingItem = await this.itemRepository.getById(itemId).catch(() => {
        //fail silently if item is not found
        return null
      })
      if (existingItem === null) {
        return null
      }

      if (existingItem?.imageId === ITEM_DEFAULTS.DEFAULT_ITEM_IMAGE_ID) {
        return existingItem
      }
      if (existingItem?.imageId) {
        const savedImage = await this.imageRepository.getById(existingItem.imageId)
        await this.imageStorageService.deleteImageFromFileSystem(savedImage.metadata.fileName)
        // Image can be deleted because currently using 1to1 relatioship between
        // an image and an item. No image can belong to multiple items
        await this.imageRepository.delete(savedImage.metadata.id)
      }
      return await this.itemRepository.update({ ...existingItem, imageId: null }, userId)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        logger.debug('Attempted to remove item or image that does not exist.', itemId)
      }
      throw error
    }
  }
}
