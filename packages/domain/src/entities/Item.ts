import { ItemCategory } from '../enums/ItemCategory'
import { Entity } from './Entity'

export interface ItemPrice {
  quantity: number | null
  unit: string | null
}

export interface ItemRange {
  normal: string
  long?: string
}

export interface BaseItem extends Entity {
  imageId: string | null
  name: string
  shortDescription: string
  mainDescription: string
  price: ItemPrice
  rarity: string | null //TODO replace with enum
  weight: number | null
  features: Array<{ featureName: string; featureDescription: string }>
  categories: ItemCategory[]
  attunement: {
    required: boolean
    qualifier?: string
  }
  throwRange?: ItemRange | null
}

export const ItemSortableKeys = ['name', 'rarity', 'price', 'weight', 'visibility', 'createdBy', 'source', 'createdAt', 'updatedAt']

export interface ArmorItem extends BaseItem {
  armorClass: {
    base: string
    dexterityBonus: boolean
    maximumBonus?: string
  }
  strengthMinimum: number | null
  stealthDisadvantage: boolean
  properties: string[]
}

export interface WeaponDamage {
  damageDice: string
  damageType: string
  qualifier?: string
}

export interface WeaponItem extends BaseItem {
  damage: WeaponDamage
  twoHandedDamage: WeaponDamage | null
  useRange: ItemRange | null
  properties: string[]
}

export type Item = BaseItem | ArmorItem | WeaponItem
