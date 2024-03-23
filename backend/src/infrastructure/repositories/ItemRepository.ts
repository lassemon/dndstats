import connection from '../database/connection'
import { ApiError, ItemRarity, Source, UnknownError, Visibility } from '@dmtool/domain'
import { unixtimeNow, uuid } from '@dmtool/common'
import { Logger } from '@dmtool/common'
import {
  DBItem,
  DatabaseItemRepositoryInterface,
  ITEM_DEFAULTS,
  ItemDBResponse,
  ItemInsertQuery,
  ItemResponse,
  ItemSearchQuery
} from '@dmtool/application'
import { omit } from 'lodash'
import { Knex } from 'knex'
import { PriceSearchQuery, WeightSearchQuery } from '@dmtool/application/src/interfaces/http/Item'

const logger = new Logger('ItemRepository')

const withAccess = (userId?: string, visibility?: `${Visibility}`[], onlyMyItems?: boolean) => (queryBuilder: Knex.QueryBuilder) => {
  const visibilityFilterIsSet = visibility?.length && visibility?.length > 0
  // double equals (==) to cover for both null and undefined
  if (userId == null) {
    queryBuilder.where({ 'items.visibility': 'public' }) // only public items
  } else {
    if (onlyMyItems === true) {
      queryBuilder.where({ 'items.createdBy': userId }) // only items created by the user
      if (visibilityFilterIsSet) {
        queryBuilder.whereIn('items.visibility', visibility)
      }
    } else {
      if (visibilityFilterIsSet) {
        queryBuilder.whereIn('items.visibility', visibility).andWhere((queryBuilder: Knex.QueryBuilder) => {
          queryBuilder.where({ 'items.createdBy': userId }).orWhereNot({ 'items.visibility': 'private' })
        })
      } else {
        // all users own items and all other items except private items of other users
        queryBuilder.where({ 'items.createdBy': userId }).orWhereNot({ 'items.visibility': 'private' })
      }
    }
  }
}

const withRarity = (rarity?: `${ItemRarity}`[]) => (queryBuilder: Knex.QueryBuilder) => {
  if (rarity?.length && rarity?.length > 0) {
    queryBuilder.whereIn('items.rarity', rarity)
  }
}

const currencyToCpConversion = {
  cp: 1,
  sp: 10,
  ep: 50,
  gp: 100,
  pp: 1000
} as { [key: string]: number }

const convertToCp = (quantity: number, unit: string) => {
  return quantity * currencyToCpConversion[unit]
}

const constructQueryForPriceOver = (quantity: number, unit: string) => {
  const quantityInCp = convertToCp(quantity, unit)
  const conditions = Object.entries(currencyToCpConversion).map(([unitKey, conversionRate]) => {
    return `(JSON_EXTRACT(price, '$.unit') = '${unitKey}' AND JSON_EXTRACT(price, '$.quantity') * ${conversionRate} >= ${quantityInCp})`
  })
  return conditions.join(' OR ')
}

const constructQueryForPriceExactly = (quantity: number, unit: string) => {
  const quantityInCp = convertToCp(quantity, unit)
  const conditions = Object.entries(currencyToCpConversion).map(([unitKey, conversionRate]) => {
    return `(JSON_EXTRACT(price, '$.unit') = '${unitKey}' AND JSON_EXTRACT(price, '$.quantity') * ${conversionRate} = ${quantityInCp})`
  })
  return conditions.join(' OR ')
}

const constructQueryForPriceUnder = (quantity: number, unit: string) => {
  const quantityInCp = convertToCp(quantity, unit)
  const conditions = Object.entries(currencyToCpConversion).map(([unitKey, conversionRate]) => {
    return `(JSON_EXTRACT(price, '$.unit') = '${unitKey}' AND JSON_EXTRACT(price, '$.quantity') * ${conversionRate} <= ${quantityInCp})`
  })
  return conditions.join(' OR ')
}

const withPrice = (price?: PriceSearchQuery) => (queryBuilder: Knex.QueryBuilder) => {
  if (price?.quantity && price?.comparison && price.unit) {
    switch (price.comparison) {
      case 'over':
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.whereRaw(constructQueryForPriceOver(price.quantity as number, price.unit as string))
        })
        break
      case 'exactly':
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.whereRaw(constructQueryForPriceExactly(price.quantity as number, price.unit as string))
        })
        break
      case 'under':
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.whereRaw(constructQueryForPriceUnder(price.quantity as number, price.unit as string))
        })
        break
    }
  }
}

const withWeight = (weight?: WeightSearchQuery) => (queryBuilder: Knex.QueryBuilder) => {
  if (weight?.quantity && weight?.comparison) {
    switch (weight.comparison) {
      case 'over':
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.where('weight', '>=', weight.quantity)
        })
        break
      case 'exactly':
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.where('weight', '=', weight.quantity)
        })
        break
      case 'under':
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.where('weight', '<=', weight.quantity)
        })
        break
    }
  }
}

class ItemRepository implements DatabaseItemRepositoryInterface {
  async getAllPublic(): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', ['public'])
        .orderBy('items.name')
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async countAll(): Promise<number> {
    const result = await connection('items')
      .count<{ count: number }>('id as count') // Count the number of item ids
      .first() // Use .first() to get the first row of the result
    return result ? result.count : 0
  }

  async count(query: ItemSearchQuery): Promise<number> {
    const result = await connection('items')
      .modify<any, ItemDBResponse[]>(withAccess(query.userId, query.visibility, query.onlyMyItems))
      .modify<any, ItemDBResponse[]>(withRarity(query.rarity))
      .modify<any, ItemDBResponse[]>(withPrice(query.price))
      .modify<any, ItemDBResponse[]>(withWeight(query.weight))
      .count<{ count: number }>('id as count')
      .first()
    return result ? result.count : 0
  }

  async search(query: ItemSearchQuery) {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from('items')
        .modify<any, ItemDBResponse[]>(withAccess(query.userId, query.visibility, query.onlyMyItems))
        .modify<any, ItemDBResponse[]>(withRarity(query.rarity))
        .modify<any, ItemDBResponse[]>(withPrice(query.price))
        .modify<any, ItemDBResponse[]>(withWeight(query.weight))
        .limit(query.itemsPerPage || 0)
        .offset(query.itemsPerPage && query.pageNumber ? query.pageNumber * query.itemsPerPage : 0)
        .orderBy('items.name')
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
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
      return this.parseDBItemJSON(item)
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
      return this.parseDBItemJSON(item)
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
      return this.parseDBItemJSON(item)
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
      return this.parseDBItemJSON(item)
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

    return this.parseDBItemJSON(item)
  }

  async create(item: ItemInsertQuery, userId: string) {
    const updatedAt = unixtimeNow()
    const itemToInsert: DBItem = {
      ...omit(item, 'createdByUserName'),
      id: item.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? uuid() : item.id, // don't allow overwriting of the default item
      ...(item.price ? { price: JSON.stringify(item.price) } : { price: '{}' }),
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

    return this.parseDBItemJSON(await this.getByIdRAW(itemToInsert.id))
  }

  async update(item: ItemInsertQuery, userId: string) {
    const updatedAt = unixtimeNow()
    const itemToInsert: DBItem = {
      ...omit(item, 'createdByUserName'),
      id: item.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? uuid() : item.id, // don't allow overwriting of the default item
      ...(item.price ? { price: JSON.stringify(item.price) } : { price: '{}' }),
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

    return this.parseDBItemJSON(await this.getByIdRAW(itemToInsert.id))
  }

  async delete(itemId: string) {
    try {
      await connection<any, DBItem>('items').where('id', itemId).delete()
    } catch (error) {
      logger.error((error as any)?.message)
      throw new UnknownError(500, 'UnknownError')
    }
  }

  private async getByIdRAW(itemId: string): Promise<ItemDBResponse> {
    const item = await connection
      .join('users', 'items.createdBy', '=', 'users.id')
      .select('items.*', 'users.name as createdByUserName')
      .from<any, ItemDBResponse>('items')
      .where('items.id', itemId)
      .first()
    if (!item) {
      throw new ApiError(404, 'NotFound', `Item was not found. ( ${itemId} )`)
    }

    return item
  }

  private parseDBItemJSON = (dbItem: ItemDBResponse): ItemResponse => {
    return {
      ...dbItem,
      price: JSON.parse(dbItem.price),
      features: JSON.parse(dbItem.features)
    }
  }
}

export default ItemRepository
