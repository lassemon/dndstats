import { ComparisonOption, Image, Item, ItemPrice, ItemRarity, Source, Visibility } from '@dmtool/domain'

export interface DBItem extends Omit<Item, 'price' | 'features'> {
  price: string
  features: string
}
export interface ItemDBResponse extends DBItem {
  createdByUserName: string
}
export interface ItemResponse extends Item {
  createdByUserName: string
}

export interface ItemUpdateRequest {
  item: Item
  image?: Image | null
}

export interface ItemUpdateResponse {
  item: ItemResponse
  image?: Image | null
}

export interface ItemInsertQuery extends Item {}

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
  source?: `${Source}`[]
  visibility?: `${Visibility}`[]
  rarity?: `${ItemRarity}`[]
  price?: PriceSearchQuery
  weight?: WeightSearchQuery
}

export interface ItemSearchRequest {
  itemsPerPage?: number
  pageNumber?: number
  onlyMyItems?: boolean
  source?: `${Source}`[]
  visibility?: `${Visibility}`[]
  rarity?: `${ItemRarity}`[]
  priceComparison?: `${ComparisonOption}`
  priceQuantity?: number
  priceUnit?: string
  weightComparison?: `${ComparisonOption}`
  weight?: number
}

export interface ItemSearchResponse {
  items: ItemResponse[]
  totalCount: number
}
