import { ArmorItem, BaseItem, ItemCategory, WeaponItem } from '@dmtool/domain'
import ItemDTO from '../dtos/ItemDTO'
import { FifthESRDEquipment, FifthESRDMagicItem } from '@dmtool/domain/src/interfaces/FifthESRD'

const WEAPON_CATEGORIES = [
  ItemCategory.WEAPON,
  ItemCategory.MARTIAL_MELEE_WEAPON,
  ItemCategory.MARTIAL_RANGED_WEAPON,
  ItemCategory.MARTIAL_WEAPON,
  ItemCategory.MELEE_WEAPON,
  ItemCategory.SIMPLE_MELEE_WEAPON,
  ItemCategory.SIMPLE_RANGED_WEAPON,
  ItemCategory.SIMPLE_WEAPON,
  ItemCategory.RANGED_WEAPON
]

const ARMOR_CATEGORIES = [
  ItemCategory.ARMOR,
  ItemCategory.HEAVY_ARMOR,
  ItemCategory.MEDIUM_ARMOR,
  ItemCategory.LIGHT_ARMOR,
  ItemCategory.SHIELD
]

export const isArmor = (item: Partial<BaseItem | WeaponItem | ArmorItem | ItemDTO>): item is ArmorItem => {
  return ARMOR_CATEGORIES.some((category) => item.categories?.includes(category))
}

export const isWeapon = (item: Partial<BaseItem | WeaponItem | ArmorItem | ItemDTO>): item is WeaponItem => {
  return WEAPON_CATEGORIES.some((category) => item.categories?.includes(category))
}

export const isFifthESRDEquipment = (item: FifthESRDEquipment | FifthESRDMagicItem): item is FifthESRDEquipment => {
  return item.url.includes('/api/equipment')
}

export const isFifthESRDMagicItem = (item: FifthESRDEquipment | FifthESRDMagicItem): item is FifthESRDMagicItem => {
  return item.url.includes('/api/magic-items')
}
