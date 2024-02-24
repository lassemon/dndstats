import connection from '../database/connection'
import { DateTime } from 'luxon'
import ApiError from '/domain/errors/ApiError'
import { Item, Source } from '@dmtool/domain'
import { uuid } from '@dmtool/common'
import UnknownError from '/domain/errors/UnknownError'
import { Logger } from '@dmtool/common'
import { DatabaseItemRepositoryInterface, ITEM_DEFAULTS } from '@dmtool/application'

const logger = new Logger('ItemRepository')

interface DBItem extends Omit<Item, 'features'> {
  features: string
}

class ItemRepository implements DatabaseItemRepositoryInterface {
  async getAll(): Promise<Item[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdBy')
        .from<any, DBItem[]>('items')
        .whereIn('visibility', ['public'])
        .orderBy('items.name')
    ).map((item) => {
      return { ...item, features: JSON.parse(item.features) }
    })
  }

  async getAllVisibleForLoggedInUser(): Promise<Item[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdBy')
        .from<any, DBItem[]>('items')
        .whereIn('visibility', ['public', 'logged_in'])
        .orderBy('items.name')
    ).map((item) => {
      return { ...item, features: JSON.parse(item.features) }
    })
  }

  async getAllForUser(userId: string): Promise<Item[]> {
    return (await connection.select('*').from<any, DBItem[]>('items').where('createdBy', userId).orderBy('name')).map((item) => {
      return { ...item, features: JSON.parse(item.features) }
    })
  }

  async countItemsCreatedByUser(userId: string): Promise<number> {
    const result = await connection('items')
      .count<{ count: number }>('id as count') // Count the number of item ids
      .where('createdBy', userId) // Apply the condition
      .first() // Use .first() to get the first row of the result
    return result ? result.count : 0
  }

  async getById(itemId: string): Promise<Item> {
    const item = await connection.select('*').from<any, DBItem>('items').where('id', itemId).first()
    if (!item) {
      throw new ApiError(404, 'NotFound', `Item was not found. ( ${itemId} )`)
    }

    return {
      ...item,
      features: JSON.parse(item.features)
    }
  }

  async save(item: Item, userId: string) {
    const updatedAt = DateTime.now().toUnixInteger()
    const itemToInsert: DBItem = {
      ...item,
      id: item.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? uuid() : item.id, // don't allow overwriting of the default item
      ...(item.features ? { features: JSON.stringify(item.features) } : { features: '[]' }),
      source: Source.HomeBrew,
      createdBy: userId,
      updatedAt: updatedAt
    }
    try {
      await connection<any, DBItem>('items').insert(itemToInsert).onConflict('id').merge() // mariadb does not return inserted object
    } catch (error) {
      logger.error((error as any)?.message)
      throw new UnknownError(500, 'UnknownError')
    }

    return {
      ...itemToInsert,
      features: JSON.parse(itemToInsert.features)
    }
  }

  async delete(itemId: string) {
    try {
      await connection<any, DBItem>('items').where('id', itemId).delete()
    } catch (error) {
      logger.error((error as any)?.message)
      throw new UnknownError(500, 'UnknownError')
    }
  }
}

export default ItemRepository
