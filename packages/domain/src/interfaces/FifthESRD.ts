export interface FifthESRDAPIReference {
  index: string
  name: string
  url?: string
}

export interface FifthESRDAPIReferenceList {
  count: number
  results: FifthESRDAPIReference[]
}

export interface FifthESRDEquipmentArmorClass {
  base: number
  dex_bonus: boolean
  max_bonus?: number
}

export interface FifthESRDEquipmentContent {
  item: FifthESRDAPIReference
  quantity: number
}

export interface FifthESRDEquipmentCost {
  quantity: number
  unit: string
}

export interface FifthESRDEquipmentDamage {
  _id?: boolean
  damage_dice: string
  damage_type: FifthESRDAPIReference
}

export interface FifthESRDEquipmentSpeed {
  quantity: number
  unit: string
}

export interface FifthESRDEquipmentRange {
  long: number
  normal: number
}

export interface FifthESRDEquipmentTwoHandedDamage {
  damage_dice: string
  damage_type: FifthESRDAPIReference
}

export interface FifthESRDEquipment {
  armor_category?: string
  armor_class?: FifthESRDEquipmentArmorClass
  capacity?: number
  category_range?: string
  contents?: FifthESRDEquipmentContent[]
  cost?: FifthESRDEquipmentCost
  damage?: FifthESRDEquipmentDamage
  desc: string[]
  equipment_category: FifthESRDAPIReference
  gear_category?: FifthESRDAPIReference
  index: string
  name: string
  properties?: FifthESRDAPIReference[]
  quantity?: number
  range?: FifthESRDEquipmentRange
  special?: string[]
  speed?: FifthESRDEquipmentSpeed
  stealth_disadvantage?: boolean
  str_minimum?: number
  throw_range?: FifthESRDEquipmentRange
  tool_category?: string
  two_handed_damage?: FifthESRDEquipmentTwoHandedDamage
  url: string
  vehicle_category?: string
  weapon_category?: string
  weapon_range?: string
  weight?: number
}

export interface FifthESRDRarity {
  _id?: boolean
  name: string
}

export interface FifthESRDMagicItem {
  desc: string[]
  equipment_category: FifthESRDAPIReference
  index: string
  name: string
  rarity: FifthESRDRarity
  url: string
  variants: FifthESRDAPIReference[]
  variant: boolean
}
