import { Entity } from './Entity'

export interface ItemPrice {
  quantity: number | null
  unit: string | null
}
export interface Item extends Entity {
  imageId: string | null
  name: string
  shortDescription: string
  mainDescription: string
  price: ItemPrice
  rarity: string | null //TODO replace with enum
  weight: number | null
  localItem?: boolean
  features: Array<{ featureName: string; featureDescription: string }>
}
