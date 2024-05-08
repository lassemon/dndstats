import { ItemCategory } from '@dmtool/domain'
import { FifthApiServiceInterface } from './FifthApiServiceInterface'
import { get } from './dataAccess/http/http'

const fifthApiUrl = 'https://www.dnd5eapi.co/api'

export const FifthApiSRDCategoriesMap = {
  'adventuring-gear': ItemCategory.ADVENTURING_GEAR,
  ammunition: ItemCategory.AMMUNITION,
  'arcane-foci': ItemCategory.ARCANE_FOCI,
  armor: ItemCategory.ARMOR,
  'artisans-tools': ItemCategory.ARTISANS_TOOL,
  'druidic-foci': ItemCategory.DRUIDIC_FOCI,
  'equipment-packs': ItemCategory.EQUIPMENT_PACK,
  'gaming-sets': ItemCategory.GAMING_SET,
  'heavy-armor': ItemCategory.HEAVY_ARMOR,
  'holy-symbols': ItemCategory.HOLY_SYMBOL,
  kits: ItemCategory.KIT,
  'land-vehicles': ItemCategory.LAND_VEHICLE,
  'light-armor': ItemCategory.LIGHT_ARMOR,
  'martial-melee-weapons': ItemCategory.MARTIAL_MELEE_WEAPON,
  'martial-ranged-weapons': ItemCategory.MARTIAL_RANGED_WEAPON,
  'martial-weapons': ItemCategory.MARTIAL_WEAPON,
  'medium-armor': ItemCategory.MEDIUM_ARMOR,
  'melee-weapons': ItemCategory.MELEE_WEAPON,
  'mounts-and-other-animals': ItemCategory.MOUNT_OR_OTHER_ANIMAL,
  'mounts-and-vehicles': ItemCategory.MOUNT_OR_VEHICLE,
  'musical-instruments': ItemCategory.MUSICAL_INSTRUMENT,
  'other-tools': ItemCategory.OTHER_TOOL,
  potion: ItemCategory.POTION,
  'ranged-weapons': ItemCategory.RANGED_WEAPON,
  ring: ItemCategory.RING,
  rod: ItemCategory.ROD,
  scroll: ItemCategory.SCROLL,
  shields: ItemCategory.SHIELD,
  'simple-melee-weapons': ItemCategory.SIMPLE_MELEE_WEAPON,
  'simple-ranged-weapons': ItemCategory.SIMPLE_RANGED_WEAPON,
  'simple-weapons': ItemCategory.SIMPLE_WEAPON,
  staff: ItemCategory.STAFF,
  'standard-gear': ItemCategory.STANDARD_GEAR,
  'tack-harness-and-drawn-vehicles': ItemCategory.TACK_HARNESS_OR_DRAWN_VEHICLE,
  tools: ItemCategory.TOOL,
  wand: ItemCategory.WAND,
  'waterborne-vehicles': ItemCategory.WATERBORNE_VEHICLE,
  weapon: ItemCategory.WEAPON,
  'wondrous-items': ItemCategory.WONDROUS_ITEM
} as { [key: string]: ItemCategory }

export interface Item {}

export class FifthApiService implements FifthApiServiceInterface {
  public async get<T>(path: string, nameQuery?: string): Promise<T> {
    const entities = await get({
      endpoint: `${fifthApiUrl}${path}`,
      queryParameters: { name: nameQuery }
    })
    return entities as T
  }

  public parseCategoryName(categoryName: string) {
    return FifthApiSRDCategoriesMap[categoryName] || ''
  }

  public parseCategoryNames(categoryNames: string[] = []) {
    return categoryNames.map(this.parseCategoryName)
  }
}
