import { Entity } from './Entity'

export interface Item extends Entity {
  imageId: string | null
  name: string
  shortDescription: string
  mainDescription: string
  price: string | null
  rarity: string | null //TODO replace with enum
  weight: string | null
  localItem?: boolean
  features: Array<{ featureName: string; featureDescription: string }>
}
