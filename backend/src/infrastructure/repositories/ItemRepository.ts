import connection from '../database/connection'
import { ApiError, ComparisonOption, ItemCategory, ItemRarity, Source, UnknownError, Visibility, WeaponProperty } from '@dmtool/domain'
import { Order, unixtimeNow, uuid } from '@dmtool/common'
import { Logger } from '@dmtool/common'
import {
  DBItem,
  DatabaseItemRepositoryInterface,
  ITEM_DEFAULTS,
  ItemDBResponse,
  ItemInsertQuery,
  ItemUpdateQuery,
  ItemResponse,
  ItemSearchQuery,
  isArmor,
  isWeapon
} from '@dmtool/application'
import { omit } from 'lodash'
import { Knex } from 'knex'
import { PriceSearchQuery, WeightSearchQuery } from '@dmtool/application/src/interfaces/http/Item'
import { ItemSortableKeys } from '@dmtool/domain'

const logger = new Logger('ItemRepository')

const withAccess =
  (userId?: string, visibility?: `${Visibility}`[], onlyMyItems: boolean = false) =>
  (queryBuilder: Knex.QueryBuilder) => {
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
          queryBuilder.andWhere((_queryBuilder) => {
            _queryBuilder.where({ 'items.createdBy': userId }).orWhereNot({ 'items.visibility': 'private' })
          })
        }
      }
    }
  }

const withRarity = (rarity?: `${ItemRarity}`[]) => (queryBuilder: Knex.QueryBuilder) => {
  if (rarity?.length && rarity?.length > 0) {
    queryBuilder.whereIn('items.rarity', rarity)
  }
}

const withCategory = (categories?: `${ItemCategory}`[]) => (queryBuilder: Knex.QueryBuilder) => {
  if (categories?.length && categories?.length > 0) {
    queryBuilder.where(function () {
      categories.forEach((category, index) => {
        const jsonCategories = JSON.stringify([category])
        if (index === 0) {
          this.whereRaw('JSON_CONTAINS(categories, ?)', [jsonCategories])
        } else {
          this.orWhereRaw('JSON_CONTAINS(categories, ?)', [jsonCategories])
        }
      })
    })
  }
}

const withProperty = (properties?: `${WeaponProperty}`[]) => (queryBuilder: Knex.QueryBuilder) => {
  if (properties?.length && properties?.length > 0) {
    queryBuilder.where(function () {
      properties.forEach((properties, index) => {
        const jsonProperties = JSON.stringify([properties])
        if (index === 0) {
          this.whereRaw('JSON_CONTAINS(properties, ?)', [jsonProperties])
        } else {
          this.orWhereRaw('JSON_CONTAINS(properties, ?)', [jsonProperties])
        }
      })
    })
  }
}

const withOrderBy = (orderBy: (typeof ItemSortableKeys)[number], order: `${Order}`) => (queryBuilder: Knex.QueryBuilder) => {
  if (orderBy) {
    const _orderBy = ItemSortableKeys.includes(orderBy) ? orderBy : 'name'
    const _order = order === Order.ASCENDING || order === Order.DESCENDING ? order : Order.ASCENDING
    switch (orderBy) {
      case 'price':
        queryBuilder.orderByRaw(`
        CAST(JSON_UNQUOTE(JSON_EXTRACT(price, "$.quantity")) AS UNSIGNED) ${_order.toUpperCase()},
        CASE JSON_UNQUOTE(JSON_EXTRACT(price, "$.unit"))
          WHEN 'pp' THEN 1
          WHEN 'gp' THEN 2
          WHEN 'ep' THEN 3
          WHEN 'sp' THEN 4
          WHEN 'cp' THEN 5
          ELSE 6
        END ASC`)
        break
      case 'rarity':
        queryBuilder.orderByRaw(`
        CASE
        WHEN rarity IS NULL THEN
            CASE WHEN '${_order}' = 'asc' THEN 0 ELSE 1 END
        ELSE
            CASE WHEN '${_order}' = 'asc' THEN 1 ELSE 0 END
    		END,
        CASE rarity
          WHEN 'varies' THEN 1
          WHEN 'common' THEN 2
          WHEN 'uncommon' THEN 3
          WHEN 'rare' THEN 4
          WHEN 'very_rare' THEN 5
          WHEN 'legendary' THEN 6
          WHEN 'artifact' THEN 7
          ELSE 8
        END ${_order.toUpperCase()}
        `)
        break
      case 'createdBy':
        queryBuilder.orderBy(`createdByUserName`, _order)
        break
      //columns that value can NOT be null
      case 'name':
      case 'visibility':
      case 'source':
        queryBuilder.orderBy(`items.${_orderBy}`, _order)
        break
      //columns that value can be null, sort nulls first
      case 'weight':
        queryBuilder.orderBy(`items.${_orderBy}`, _order, 'first')
        break
      default:
        queryBuilder.orderBy(`items.${_orderBy}`, _order)
        break
    }
  }
}

const currencyToCpConversion = {
  cp: 1,
  sp: 10,
  ep: 50,
  gp: 100,
  pp: 1000
} as { [key: string]: number }

const convertToCp = (quantity: number | null, unit: string) => {
  return (quantity || 0) * currencyToCpConversion[unit]
}

const constructQueryForPriceOver = (quantity: number | null, unit: string) => {
  const quantityInCp = convertToCp(quantity, unit)
  const conditions = Object.entries(currencyToCpConversion).map(([unitKey, conversionRate]) => {
    return `(JSON_EXTRACT(price, '$.unit') = '${unitKey}' AND JSON_EXTRACT(price, '$.quantity') * ${conversionRate} >= ${quantityInCp})`
  })
  return conditions.join(' OR ')
}

const constructQueryForPriceExactly = (quantity: number | null, unit: string) => {
  const quantityInCp = convertToCp(quantity, unit)
  const conditions = Object.entries(currencyToCpConversion).map(([unitKey, conversionRate]) => {
    return `(JSON_EXTRACT(price, '$.unit') = '${unitKey}' AND JSON_EXTRACT(price, '$.quantity') * ${conversionRate} = ${quantityInCp})`
  })
  return conditions.join(' OR ')
}

const constructQueryForPriceUnder = (quantity: number | null, unit: string) => {
  const quantityInCp = convertToCp(quantity, unit)
  const conditions = Object.entries(currencyToCpConversion).map(([unitKey, conversionRate]) => {
    return `(JSON_EXTRACT(price, '$.unit') = '${unitKey}' AND JSON_EXTRACT(price, '$.quantity') * ${conversionRate} <= ${quantityInCp})`
  })
  return conditions.join(' OR ')
}

const withPrice = (price?: PriceSearchQuery) => (queryBuilder: Knex.QueryBuilder) => {
  if (price && price.quantity && price.comparison && price.unit) {
    switch (price.comparison) {
      case ComparisonOption.MINIMUM:
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.whereRaw(constructQueryForPriceOver(price.quantity, price.unit as string))
        })
        break
      case 'exactly':
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.whereRaw(constructQueryForPriceExactly(price.quantity, price.unit as string))
        })
        break
      case ComparisonOption.MAXIMUM:
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.whereRaw(constructQueryForPriceUnder(price.quantity, price.unit as string))
        })
        break
    }
  }
}

const withWeight = (weight?: WeightSearchQuery) => (queryBuilder: Knex.QueryBuilder) => {
  if (weight?.quantity && weight?.comparison) {
    switch (weight.comparison) {
      case ComparisonOption.MINIMUM:
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.where('weight', '>=', weight.quantity)
        })
        break
      case 'exactly':
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.where('weight', '=', weight.quantity)
        })
        break
      case ComparisonOption.MAXIMUM:
        queryBuilder.andWhere((_queryBuilder) => {
          _queryBuilder.where('weight', '<=', weight.quantity)
        })
        break
    }
  }
}

const withSource = (source?: `${Source}`[]) => (queryBuilder: Knex.QueryBuilder) => {
  if (source?.length && source?.length > 0) {
    queryBuilder.whereIn('items.source', source)
  }
}

const withRequiresAttunement = (requiresAttunement?: boolean | null) => (queryBuilder: Knex.QueryBuilder) => {
  if (requiresAttunement === true || requiresAttunement === false) {
    queryBuilder.whereRaw(`JSON_EXTRACT(attunement, '$.required') = '${requiresAttunement}'`)
  }
}

const withHasImage = (hasImage?: boolean | null) => (queryBuilder: Knex.QueryBuilder) => {
  if (hasImage === true || hasImage === false) {
    hasImage ? queryBuilder.whereNot('items.imageId', null) : queryBuilder.where('items.imageId', null)
  }
}

const withWordSearch = (wordSearch?: string) => (queryBuilder: Knex.QueryBuilder) => {
  if (wordSearch) {
    queryBuilder.whereILike('items.name', `%${wordSearch}%`)
    queryBuilder.orWhereILike('items.shortDescription', `%${wordSearch}%`)
    queryBuilder.orWhereILike('items.mainDescription', `%${wordSearch}%`)
  }
}

class ItemRepository implements DatabaseItemRepositoryInterface {
  async getAllPublic(orderBy: string, order: `${Order}`): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', ['public'])
        .modify<any, ItemDBResponse[]>(withOrderBy(orderBy, order))
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async getLatest(limit: number, loggedIn: boolean): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', [...(loggedIn ? [Visibility.LOGGED_IN] : []), Visibility.PUBLIC])
        .modify<any, ItemDBResponse[]>(withOrderBy('createdAt', Order.DESCENDING))
        .limit(limit || 5)
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async countAll(userId?: string): Promise<number> {
    const result = await connection('items')
      .whereNotIn('visibility', userId ? ['private'] : ['private', 'logged_in'])
      .count<{ count: number }>('id as count') // Count the number of item ids
      .first() // Use .first() to get the first row of the result
    return result ? result.count : 0
  }

  async count(query: Omit<ItemSearchQuery, 'order' | 'orderBy'>): Promise<number> {
    const result = await connection('items')
      .modify<any, ItemDBResponse[]>(withAccess(query.userId, query.visibility, query.onlyMyItems))
      .modify<any, ItemDBResponse[]>(withRarity(query.rarity))
      .modify<any, ItemDBResponse[]>(withCategory(query.category))
      .modify<any, ItemDBResponse[]>(withProperty(query.property))
      .modify<any, ItemDBResponse[]>(withPrice(query.price))
      .modify<any, ItemDBResponse[]>(withWeight(query.weight))
      .modify<any, ItemDBResponse[]>(withSource(query.source))
      .modify<any, ItemDBResponse[]>(withRequiresAttunement(query.requiresAttunement))
      .modify<any, ItemDBResponse[]>(withHasImage(query.hasImage))
      .modify<any, ItemDBResponse[]>(withWordSearch(query.search))
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
        .modify<any, ItemDBResponse[]>(withCategory(query.category))
        .modify<any, ItemDBResponse[]>(withProperty(query.property))
        .modify<any, ItemDBResponse[]>(withPrice(query.price))
        .modify<any, ItemDBResponse[]>(withWeight(query.weight))
        .modify<any, ItemDBResponse[]>(withSource(query.source))
        .modify<any, ItemDBResponse[]>(withRequiresAttunement(query.requiresAttunement))
        .modify<any, ItemDBResponse[]>(withHasImage(query.hasImage))
        .modify<any, ItemDBResponse[]>(withWordSearch(query.search))
        .modify<any, ItemDBResponse[]>(withOrderBy(query.orderBy, query.order))
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async getByImageId(imageId: string): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .where({ imageId })
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
        .modify<any, ItemDBResponse[]>(withOrderBy('name', 'asc'))
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async getAllVisibleForLoggedInUser(userId: string, orderBy: string, order: `${Order}`): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', ['public', 'logged_in'])
        .orWhere('items.createdBy', userId)
        .modify<any, ItemDBResponse[]>(withOrderBy(orderBy, order))
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
        .modify<any, ItemDBResponse[]>(withOrderBy('name', 'asc'))
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
        .modify<any, ItemDBResponse[]>(withOrderBy('name', 'asc'))
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

  async getItemsByIdsAndSources(items: { itemId: string; source: string }[]): Promise<ItemResponse[]> {
    const result = await connection
      .join('users', 'items.createdBy', '=', 'users.id')
      .select('items.*', 'users.name as createdByUserName')
      .from<any, ItemDBResponse[]>('items')
      .where((queryBuilder: Knex.QueryBuilder) => {
        items.forEach((item) => {
          queryBuilder.orWhere({
            'items.id': item.itemId,
            'items.source': item.source
          })
        })
      })

    return result?.map(this.parseDBItemJSON)
  }

  async getByIdAndSource(itemId: string, source: `${Source}`): Promise<ItemResponse> {
    const item = await connection
      .join('users', 'items.createdBy', '=', 'users.id')
      .select('items.*', 'users.name as createdByUserName')
      .from<any, ItemDBResponse>('items')
      .where('items.id', itemId)
      .andWhere('items.source', source)
      .first()
    if (!item) {
      throw new ApiError(404, 'NotFound', `Item was not found. ( id: ${itemId} source: ${source} )`)
    }

    return this.parseDBItemJSON(item)
  }

  async create(item: ItemInsertQuery, userId: string) {
    const itemToInsert: DBItem = this.constructItemToInsertFromQuery(item, userId)
    try {
      await connection<any, DBItem>('items').insert(itemToInsert) // mariadb does not return inserted object
    } catch (error: any) {
      logger.error((error as any)?.message, error.stack ? error.stack : error)
      throw new UnknownError(500, 'UnknownError')
    }

    return this.parseDBItemJSON(await this.getByIdRAW(itemToInsert.id))
  }

  async update(item: ItemInsertQuery) {
    const itemToInsert: DBItem = this.constructItemToUpdateFromQuery(item)
    try {
      // TODO use update here instead of insert
      // need to create separate POST and PUT into ItemController
      await connection<any, DBItem>('items').where('id', item.id).update(itemToInsert) // mariadb does not return inserted object
    } catch (error: any) {
      logger.error((error as any)?.message, error.stack ? error.stack : error)
      throw new UnknownError(500, 'UnknownError')
    }

    return this.parseDBItemJSON(await this.getByIdRAW(itemToInsert.id))
  }

  async delete(itemId: string) {
    try {
      await connection<any, DBItem>('items').where('id', itemId).delete()
    } catch (error: any) {
      logger.error((error as any)?.message, error.stack ? error.stack : error)
      throw new UnknownError(500, 'UnknownError')
    }
  }

  // RAW in this case means without converting the stringified json data into json
  private async getByIdRAW(itemId: string): Promise<ItemDBResponse> {
    const item = await connection
      .join('users', 'items.createdBy', '=', 'users.id')
      .select('items.*', 'users.name as createdByUserName')
      .from<any, ItemDBResponse>('items')
      .where('items.id', itemId)
      .first()
    if (!item) {
      throw new ApiError(404, 'NotFound', `RAW Item was not found. ( ${itemId} )`)
    }

    return item
  }

  private parseDBItemJSON = (dbItem: ItemDBResponse): ItemResponse => {
    return {
      ...dbItem,
      price: JSON.parse(dbItem.price),
      features: JSON.parse(dbItem.features),
      categories: JSON.parse(dbItem.categories),
      attunement: JSON.parse(dbItem.attunement),
      armorClass: dbItem.armorClass !== null ? JSON.parse(dbItem.armorClass) : null,
      damage: dbItem.damage !== null ? JSON.parse(dbItem.damage) : null,
      twoHandedDamage: dbItem.twoHandedDamage !== null ? JSON.parse(dbItem.twoHandedDamage) : null,
      throwRange: dbItem.throwRange !== null ? JSON.parse(dbItem.throwRange) : null,
      useRange: dbItem.useRange !== null ? JSON.parse(dbItem.useRange) : null,
      stealthDisadvantage: dbItem.stealthDisadvantage === 1 ? true : false,
      properties: dbItem.properties !== null ? JSON.parse(dbItem.properties) : null
    }
  }

  private constructItemToInsertFromQuery = (insertQuery: ItemInsertQuery, userId: string): DBItem => {
    const updatedAt = unixtimeNow()
    return {
      ...omit(insertQuery, 'createdByUserName'),
      id: insertQuery.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? uuid() : insertQuery.id, // don't allow overwriting of the default item
      imageId: insertQuery.imageId,
      ...(insertQuery.price ? { price: JSON.stringify(insertQuery.price) } : { price: '{}' }),
      ...(insertQuery.features ? { features: JSON.stringify(insertQuery.features) } : { features: '[]' }),
      ...(insertQuery.categories ? { categories: JSON.stringify(insertQuery.categories) } : { categories: '[]' }),
      source: insertQuery.source || Source.HomeBrew,
      ...(insertQuery.attunement
        ? { attunement: JSON.stringify(insertQuery.attunement) }
        : { attunement: JSON.stringify({ required: false }) }),
      ...(isArmor(insertQuery) && insertQuery.armorClass ? { armorClass: JSON.stringify(insertQuery.armorClass) } : { armorClass: null }),
      strengthMinimum: (isArmor(insertQuery) && insertQuery.strengthMinimum) || '',
      stealthDisadvantage: (isArmor(insertQuery) && insertQuery.stealthDisadvantage === true ? 1 : 0) || 0,
      ...(isWeapon(insertQuery) && insertQuery.damage ? { damage: JSON.stringify(insertQuery.damage) } : { damage: null }),
      ...(isWeapon(insertQuery) && insertQuery.twoHandedDamage
        ? { twoHandedDamage: JSON.stringify(insertQuery.twoHandedDamage) }
        : { twoHandedDamage: null }),
      ...(isWeapon(insertQuery) && insertQuery.throwRange ? { throwRange: JSON.stringify(insertQuery.throwRange) } : { throwRange: null }),
      ...(isWeapon(insertQuery) && insertQuery.useRange ? { useRange: JSON.stringify(insertQuery.useRange) } : { useRange: null }),
      ...(isWeapon(insertQuery) || (isArmor(insertQuery) && insertQuery.properties)
        ? { properties: JSON.stringify(insertQuery.properties) }
        : { properties: '[]' }),
      createdBy: userId,
      createdAt: updatedAt,
      updatedAt: updatedAt
    }
  }

  private constructItemToUpdateFromQuery = (item: ItemUpdateQuery): DBItem => {
    const updatedAt = unixtimeNow()
    return {
      ...omit(item, 'createdByUserName', 'createdAt'),
      id: item.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? uuid() : item.id, // don't allow overwriting of the default item
      imageId: item.imageId,
      ...(item.price ? { price: JSON.stringify(item.price) } : { price: '{}' }),
      ...(item.features ? { features: JSON.stringify(item.features) } : { features: '[]' }),
      ...(item.categories ? { categories: JSON.stringify(item.categories) } : { categories: '[]' }),
      source: item.source || Source.HomeBrew,
      ...(item.attunement ? { attunement: JSON.stringify(item.attunement) } : { attunement: JSON.stringify({ required: false }) }),
      ...(isArmor(item) && item.armorClass ? { armorClass: JSON.stringify(item.armorClass) } : { armorClass: null }),
      strengthMinimum: (isArmor(item) && item.strengthMinimum) || '',
      stealthDisadvantage: (isArmor(item) && item.stealthDisadvantage === true ? 1 : 0) || 0,
      ...(isWeapon(item) && item.damage ? { damage: JSON.stringify(item.damage) } : { damage: null }),
      ...(isWeapon(item) && item.twoHandedDamage ? { twoHandedDamage: JSON.stringify(item.twoHandedDamage) } : { twoHandedDamage: null }),
      ...(isWeapon(item) && item.throwRange ? { throwRange: JSON.stringify(item.throwRange) } : { throwRange: null }),
      ...(isWeapon(item) && item.useRange ? { useRange: JSON.stringify(item.useRange) } : { useRange: null }),
      ...(isWeapon(item) || (isArmor(item) && item.properties) ? { properties: JSON.stringify(item.properties) } : { properties: '[]' }),
      createdAt: item.createdAt,
      updatedAt: updatedAt
    }
  }
}

export default ItemRepository
