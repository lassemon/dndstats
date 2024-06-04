import { Order } from '@dmtool/common'
import {
  BaseItem,
  ComparisonOption,
  Image,
  Item,
  ItemCategory,
  ItemPrice,
  ItemRarity,
  Source,
  Visibility,
  WeaponProperty
} from '@dmtool/domain'
import { ArmorItem, WeaponItem, ItemSortableKeys } from '@dmtool/domain'

type DBJSONFields =
  | 'price'
  | 'features'
  | 'categories'
  | 'attunement'
  | 'armorClass'
  | 'damage'
  | 'twoHandedDamage'
  | 'throwRange'
  | 'useRange'
  | 'properties'

type DBItemWithoutJSONFields = Omit<Item, DBJSONFields>

type DBArmorItemWithoutJSONFields = Omit<ArmorItem, DBJSONFields | 'stealthDisadvantage'> & {
  stealthDisadvantage: number
}
type DBWeaponItemWithoutJSONFields = Omit<WeaponItem, DBJSONFields>
export interface DBItem extends DBItemWithoutJSONFields, DBArmorItemWithoutJSONFields, DBWeaponItemWithoutJSONFields {
  price: string
  features: string
  categories: string
  attunement: string
  armorClass: string | null
  damage: string | null
  twoHandedDamage: string | null
  throwRange: string | null
  useRange: string | null
  properties: string | null
}
export interface ItemDBResponse extends DBItem {
  createdByUserName: string
}

export interface ItemViews {
  itemId: string
  source: `${Source}`
  viewCount: number
}

export type BaseItemResponse = BaseItem & {
  createdByUserName: string
  url?: string
}

export type ArmorItemResponse = BaseItemResponse & ArmorItem

export type WeaponItemResponse = BaseItemResponse & WeaponItem

export type ItemResponse = BaseItemResponse | ArmorItemResponse | WeaponItemResponse
export interface ItemUpdateRequest {
  item: BaseItem & ArmorItem & WeaponItem
  image?: Image | null
}

export interface ItemUpdateResponse {
  item: ItemResponse
  image?: Image | null
}

export type ItemInsertQuery = Item
export type ItemUpdateQuery = Partial<Item> & { id: string }

export interface PriceSearchQuery extends ItemPrice {
  comparison: `${ComparisonOption}`
}

export interface WeightSearchQuery {
  quantity: number
  comparison: `${ComparisonOption}`
}
export interface ItemSearchQuery {
  itemsPerPage?: number
  pageNumber?: number
  userId?: string
  onlyMyItems?: boolean
  order: `${Order}`
  orderBy: (typeof ItemSortableKeys)[number]
  search?: string
  source?: `${Source}`[]
  visibility?: `${Visibility}`[]
  rarity?: `${ItemRarity}`[]
  category?: `${ItemCategory}`[]
  property?: `${WeaponProperty}`[]
  price?: PriceSearchQuery
  weight?: WeightSearchQuery
  requiresAttunement?: boolean | null
  hasImage?: boolean | null
}

export interface ItemCountQuery extends Omit<ItemSearchQuery, 'order' | 'orderBy'> {}

export interface ItemSearchRequest {
  itemsPerPage?: number
  pageNumber?: number
  onlyMyItems?: boolean
  order: `${Order}`
  orderBy: (typeof ItemSortableKeys)[number]
  search?: string
  source?: `${Source}`[]
  visibility?: `${Visibility}`[]
  rarity?: `${ItemRarity}`[]
  category?: `${ItemCategory}`[]
  property?: `${WeaponProperty}`[]
  priceComparison?: `${ComparisonOption}`
  priceQuantity?: string
  priceUnit?: string
  weightComparison?: `${ComparisonOption}`
  weight?: string
  requiresAttunement?: boolean | null
  hasImage?: boolean | null
}

export interface ItemSearchResponse {
  items: ItemResponse[]
  totalCount: number
}
