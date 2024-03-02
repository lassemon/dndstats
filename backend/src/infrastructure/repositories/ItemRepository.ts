import connection from '../database/connection'
import { ApiError, Source, UnknownError } from '@dmtool/domain'
import { unixtimeNow, uuid } from '@dmtool/common'
import { Logger } from '@dmtool/common'
import { DBItem, DatabaseItemRepositoryInterface, ITEM_DEFAULTS, ItemDBResponse, ItemInsertQuery, ItemResponse } from '@dmtool/application'
import { omit } from 'lodash'

const logger = new Logger('ItemRepository')

class ItemRepository implements DatabaseItemRepositoryInterface {
  async getAll(): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', ['public'])
        .orderBy('items.name')
    ).map((item) => {
      return { ...item, features: JSON.parse(item.features) }
    })
  }

  async countAll(): Promise<number> {
    const result = await connection('items')
      .count<{ count: number }>('id as count') // Count the number of item ids
      .first() // Use .first() to get the first row of the result
    return result ? result.count : 0
  }

  async getSystemItemsByName(itemName: string): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .where({ source: Source.System })
        .whereLike('items.name', `${itemName}%`)
        .orderBy('items.name')
    ).map((item) => {
      return { ...item, features: JSON.parse(item.features) }
    })
  }

  async getAllVisibleForLoggedInUser(userId: string): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', ['public', 'logged_in'])
        .orWhere('items.createdBy', userId)
        .orderBy('items.name')
    ).map((item) => {
      return { ...item, features: JSON.parse(item.features) }
    })
  }

  async getAllForUser(userId: string): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .where('items.createdBy', userId)
        .orderBy('items.name')
    ).map((item) => {
      return { ...item, features: JSON.parse(item.features) }
    })
  }

  async getUserItemsByName(itemName: string, userId: string): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .where({ createdBy: userId })
        .whereNot({ source: Source.System })
        .whereLike('items.name', `${itemName}%`)
        .orderBy('items.name')
    ).map((item) => {
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

  async getById(itemId: string): Promise<ItemResponse> {
    const item = await connection
      .join('users', 'items.createdBy', '=', 'users.id')
      .select('items.*', 'users.name as createdByUserName')
      .from<any, ItemDBResponse>('items')
      .where('items.id', itemId)
      .first()
    if (!item) {
      throw new ApiError(404, 'NotFound', `Item was not found. ( ${itemId} )`)
    }

    return {
      ...item,
      features: JSON.parse(item.features)
    }
  }

  async create(item: ItemInsertQuery, userId: string) {
    const updatedAt = unixtimeNow()
    const itemToInsert: DBItem = {
      ...omit(item, 'createdByUserName'),
      id: item.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? uuid() : item.id, // don't allow overwriting of the default item
      ...(item.features ? { features: JSON.stringify(item.features) } : { features: '[]' }),
      source: Source.HomeBrew,
      createdBy: userId,
      createdAt: updatedAt,
      updatedAt: updatedAt
    }
    try {
      await connection<any, DBItem>('items').insert(itemToInsert) // mariadb does not return inserted object
    } catch (error) {
      logger.error((error as any)?.message)
      throw new UnknownError(500, 'UnknownError')
    }

    return {
      ...itemToInsert,
      features: JSON.parse(itemToInsert.features)
    }
  }

  async update(item: ItemInsertQuery, userId: string) {
    const updatedAt = unixtimeNow()
    const itemToInsert: DBItem = {
      ...omit(item, 'createdByUserName'),
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
