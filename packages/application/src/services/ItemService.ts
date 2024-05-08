import ItemServiceInterface from './ItemServiceInterface'
import { DatabaseItemRepositoryInterface } from '../repositories/ItemRepositoryInterface'
import { find, isEmpty } from 'lodash'

export class ItemService implements ItemServiceInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface) {}

  async systemItemsWithSameNameCount(itemName: string) {
    const itemsWithName = await this.itemRepository.getSystemItemsByName(itemName)
    return itemsWithName.length
  }

  async userItemsWithSameName(itemName: string, userId: string) {
    return await this.itemRepository.getUserItemsByName(itemName, userId)
  }

  async itemExists(itemId: string, userId: string) {
    const allUsersItems = await this.itemRepository.getAllForUser(userId)
    return !!find(allUsersItems, { id: itemId })
  }

  async itemWithNameExistsForUser(itemId: string, itemName: string, userId: string) {
    const allItemsOfUser = await this.itemRepository.getAllForUser(userId)
    const allItemsWithSameName = allItemsOfUser.filter((item) => item.name === itemName)
    const updatingExistingItem = !!find(allItemsWithSameName, { id: itemId })
    const itemWithSameNameExists = !isEmpty(allItemsWithSameName)
    return !updatingExistingItem && itemWithSameNameExists
  }

  getEndIndexFromItemName(itemName?: string) {
    if (!itemName) {
      return ''
    }
    const pattern = /#(\d+)$/
    const match = itemName.match(pattern)

    const existingEndIndex = parseInt(match ? match[1] : '0')

    // If a match is found, return the first group (the digits). Otherwise, return '0'.
    return match ? `#${existingEndIndex + 1}` : ''
  }
}
