import {
  DatabaseItemRepositoryInterface,
  ITEM_DEFAULTS,
  ItemServiceInterface,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'
import { ApiError, Image, Item } from '@dmtool/domain'
import { SaveImageUseCase } from './SaveImageUseCase'

import _, { orderBy, head } from 'lodash'
import { uuid } from '@dmtool/common'

interface SaveItemUseCaseBody {
  userId: string
  item: Item
  image?: Image | null
}

interface SaveItemUseCaseResponse extends Omit<SaveItemUseCaseBody, 'userId'> {}

export interface SaveItemUseCaseOptions extends UseCaseOptionsInterface, SaveItemUseCaseBody {}

export type SaveItemUseCaseInterface = UseCaseInterface<SaveItemUseCaseOptions, SaveItemUseCaseResponse>

export class SaveItemUseCase implements SaveItemUseCaseInterface {
  constructor(
    private readonly itemService: ItemServiceInterface,
    private readonly itemRepository: DatabaseItemRepositoryInterface,
    private readonly saveImageUseCase: SaveImageUseCase
  ) {}
  async execute({ userId, item, image, unknownError, invalidArgument }: SaveItemUseCaseOptions): Promise<SaveItemUseCaseResponse> {
    // To keep things as simple as possible, saving image and item always togeher
    // First removing old image, whether item is new or updated, the old image is redundant

    const systemItemsWithSameNameCount = await this.itemService.systemItemsWithSameNameCount(item.name)
    const isUpdatingUsersExistingItem = await this.itemService.itemExists(item.id, userId)
    if (await this.itemService.itemWithNameExistsForUser(item.id, item.name, userId)) {
      throw new ApiError(406, 'NotAcceptable', `Item with the name ${item.name} already exists in your items.`)
    }
    let existingItem = null
    try {
      existingItem = await this.itemRepository.getById(item.id)
    } catch (error) {
      // silently fail for not finding existing items
    }

    if (systemItemsWithSameNameCount > 0) {
      if (!isUpdatingUsersExistingItem) {
        const userItemsWithSameName = await this.itemService.userItemsWithSameName(item.name, userId)
        const itemWithLargestIndex = head(orderBy(userItemsWithSameName, 'name', 'desc'))
        item.name = `${item.name} ${this.itemService.getEndIndexFromItemName(itemWithLargestIndex?.name)}`
      } else {
        item.name = `${item.name} #${systemItemsWithSameNameCount}`
      }
    }

    const creatingNewItem = item.id === ITEM_DEFAULTS.NEW_ITEM_ID || !isUpdatingUsersExistingItem || existingItem?.createdBy !== userId

    console.log('creating new item', creatingNewItem)

    if (creatingNewItem) {
      item.id = uuid()
    }

    // clearing image in all item create/update cases and uploading a new image to replace one
    // if the request has one. This ensures images will be cleaned from the backend
    // if user removes them from the item in the UI
    //await this.removeImageFromItemUseCase.execute({ itemId: item.id, userId, unknownError, invalidArgument })
    let savedImage = null
    if (image) {
      image.metadata.fileName = item.name.replaceAll(' ', '').toLowerCase()
      if (creatingNewItem) {
        image.metadata.id = uuid()
        image.metadata.createdBy = userId
        image.metadata.ownerId = item.id
      }
      savedImage = await this.saveImageUseCase.execute({ image, unknownError, invalidArgument })
    }

    let savedItem = null

    if (creatingNewItem) {
      savedItem = await this.itemRepository.create(
        {
          ...this.convertItemToSave(item),
          ...(savedImage ? { imageId: savedImage.metadata.id } : {})
        },
        userId
      )
    } else {
      savedItem = await this.itemRepository.update({
        ...this.convertItemToSave(item),
        ...(savedImage ? { imageId: savedImage.metadata.id } : {})
      })
    }

    return {
      item: savedItem,
      image: savedImage
    }
  }

  private convertItemToSave = (item: Item) => {
    return {
      ...item,
      name: item.name
        .split(' ')
        .map((namepart) => _.capitalize(namepart))
        .join(' ')
    }
  }
}
