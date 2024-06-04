import {
  DatabaseItemRepositoryInterface,
  ItemResponse,
  UseCaseInterface,
  UseCaseOptionsInterface,
  isArmor,
  isFifthESRDMagicItem,
  isWeapon
} from '@dmtool/application'
import { removeTrailingComma, removeStrings, unixtimeNow, removeLeadingComma } from '@dmtool/common'
import { ApiError, FifthESRDAPIReferenceList, FifthESRDEquipment, Item, ItemCategory, ItemRarity, Source, Visibility } from '@dmtool/domain'
import { FifthESRDMagicItem } from '@dmtool/domain/src/interfaces/FifthESRD'
import { FifthApiServiceInterface } from '@dmtool/infrastructure'
import _ from 'lodash'

type GetFifthSRDItemUseCaseResponse = ItemResponse

const FifthApiDescriptionTermsToRemove = ['Wondrous Items']

export interface GetFifthSRDItemUseCaseOptions extends UseCaseOptionsInterface {
  itemName: string
}

export type GetMonsterUseCaseInterface = UseCaseInterface<GetFifthSRDItemUseCaseOptions, GetFifthSRDItemUseCaseResponse>

export class GetFifthSRDItemUseCase implements GetMonsterUseCaseInterface {
  constructor(
    private readonly fifthApiService: FifthApiServiceInterface,
    private readonly itemRepository: DatabaseItemRepositoryInterface
  ) {}

  async execute({ itemName, unknownError }: GetFifthSRDItemUseCaseOptions) {
    try {
      const fifthApiItemResponse = await this.fifthApiService.get<FifthESRDEquipment>(`/equipment/${itemName}`).catch(async () => {
        return await this.fifthApiService.get<FifthESRDMagicItem>(`/magic-items/${itemName}`)
      })
      //console.log('fifthApiItemResponse', fifthApiItemResponse)
      const parsedFithApiItem = await this.parseItemFromFifthApiItemResponse(fifthApiItemResponse)

      let item = parsedFithApiItem

      if (item === null) {
        throw new ApiError(404, 'NotFound')
      }

      if (parsedFithApiItem) {
        console.log('fifth api item PARSED', parsedFithApiItem)
        try {
          // TODO, would it be better to not update fifth api item if it exists?
          item = await this.itemRepository.update(
            _.omit(parsedFithApiItem, ['shortDescription', 'mainDescription', 'features', 'createdBy', 'createdAt', 'imageId'])
          )
          console.log('fifth api item UPDATED', item)
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) {
            item = await this.itemRepository.create(parsedFithApiItem, parsedFithApiItem.createdBy)
            console.log('fifth api item SAVED', item)
          }
        }
      }

      return {
        createdByUserName: process.env.SYSTEM_USER_NAME || 'system',
        ...item
      }
    } catch (error) {
      unknownError(error)
      throw error
    }
  }

  private parseItemFromFifthApiItemResponse = async (
    fifthApiItemResponse: FifthESRDEquipment | FifthESRDMagicItem
  ): Promise<Item | null> => {
    let fiftEditionBaseItem = null
    const categories = await this.parseItemCategoriesFromFifthApiItemResponse(fifthApiItemResponse)
    if (isFifthESRDMagicItem(fifthApiItemResponse)) {
      fiftEditionBaseItem = {
        id: fifthApiItemResponse.index,
        imageId: null,
        name: fifthApiItemResponse.name
          .split(' ')
          .map((namepart) => _.capitalize(namepart))
          .join(' '),
        shortDescription: this.parseShortDescriptionFromFifthApiMagicItemResponse(fifthApiItemResponse),
        mainDescription: this.parseMainDescriptionFromFifthApiResponse(_.tail(fifthApiItemResponse.desc) || []).join('\n'),
        price: {
          quantity: null,
          unit: null
        },
        attunement: {
          required: fifthApiItemResponse.desc[0]?.includes('requires attunement')
        },
        rarity: fifthApiItemResponse.rarity.name.toLowerCase().replaceAll(' ', '_'),
        visibility: Visibility.PUBLIC,
        weight: null,
        features: [],
        categories: categories.concat(ItemCategory.MAGIC_ITEM),
        source: Source.FifthESRD,
        createdBy: process.env.SYSTEM_USER_ID || '0',
        createdAt: unixtimeNow()
      } as Item
    } else {
      fiftEditionBaseItem = {
        id: fifthApiItemResponse.index,
        imageId: null,
        name: fifthApiItemResponse.name
          .split(' ')
          .map((namepart) => _.capitalize(namepart))
          .join(' '),
        shortDescription: '',
        mainDescription: `${this.parseMainDescriptionFromFifthApiResponse(fifthApiItemResponse.desc || []).join('\n')}`,
        price: {
          quantity: Number(fifthApiItemResponse.cost?.quantity),
          unit: fifthApiItemResponse.cost?.unit
        },
        attunement: {
          required: false
        },
        rarity: null,
        visibility: Visibility.PUBLIC,
        weight: Number(fifthApiItemResponse?.weight) || null,
        features: [],
        categories,
        source: Source.FifthESRD,
        createdBy: process.env.SYSTEM_USER_ID || '0', // TODO use env variable here for system id
        createdAt: unixtimeNow()
      } as Item

      if (isArmor({ categories } as any)) {
        fiftEditionBaseItem = {
          ...fiftEditionBaseItem,
          armorClass: {
            base: fifthApiItemResponse.armor_class?.base?.toString() || '',
            dexterityBonus: fifthApiItemResponse.armor_class?.dex_bonus || false,
            maximumBonus: fifthApiItemResponse.armor_class?.max_bonus?.toString()
          },
          strengthMinimum: fifthApiItemResponse.str_minimum?.toString() || null,
          stealthDisadvantage: fifthApiItemResponse.stealth_disadvantage || false,
          properties: fifthApiItemResponse.properties?.map((property) => property.index) || []
        }
      } else if (isWeapon({ categories } as any)) {
        fiftEditionBaseItem = {
          ...fiftEditionBaseItem,
          damage: {
            damageDice: fifthApiItemResponse.damage?.damage_dice || '',
            damageType: fifthApiItemResponse.damage?.damage_type.index || ''
          },
          twoHandedDamage: fifthApiItemResponse.two_handed_damage
            ? {
                damageDice: fifthApiItemResponse.two_handed_damage?.damage_dice || '',
                damageType: fifthApiItemResponse.two_handed_damage?.damage_type.index || ''
              }
            : null,
          throwRange: fifthApiItemResponse.throw_range
            ? {
                normal: fifthApiItemResponse.throw_range?.normal?.toString() || '',
                long: fifthApiItemResponse.throw_range?.long?.toString() || ''
              }
            : null,
          useRange: {
            normal: fifthApiItemResponse.range?.normal?.toString() || '',
            long: fifthApiItemResponse.range?.long?.toString() || ''
          },
          properties: fifthApiItemResponse.properties?.map((property) => property.index) || []
        }
      }
    }
    return fiftEditionBaseItem
  }

  private parseMainDescriptionFromFifthApiResponse = (description: string[]) => {
    return description.map((currentRow, index) => {
      const previousRow = description[index - 1] as string | undefined
      const nextRow = description[index + 1] as string | undefined
      if (currentRow.startsWith('|') && !previousRow?.startsWith('|')) {
        return `\n${currentRow}`
      }
      if (currentRow.startsWith('|') && !nextRow?.startsWith('|')) {
        return `${currentRow}\n`
      }
      // this boldening is diffficult. we have no idea if the entry before the table is supposed to be the table header or just text of previous content
      if (nextRow?.startsWith('|') && !currentRow.startsWith('|') && !currentRow.includes('.,')) {
        return `\n**${currentRow}**`
      }
      return currentRow
    })
  }

  private parseDescriptionParts = (description: string) => {
    const rarityPattern = `,\\s*(${Object.values(ItemRarity)
      .map((rarity) => rarity.replaceAll('_', ' '))
      .join('|')})([\\s\\S]*)$`
    const rarityRegex = new RegExp(rarityPattern, 'i')
    const match = description.match(rarityRegex)
    if (match && match.index !== undefined) {
      const category = description.substring(0, match.index)
      const rarity = match[1] + match[2] // Combine the matched rarity keyword with the rest
      return { category, rarity }
    }
    // If no rarity pattern is matched (fallback)
    return { category: description, rarity: '' }
  }

  private parseShortDescriptionFromFifthApiMagicItemResponse = (fifthApiItemResponse: FifthESRDMagicItem) => {
    let parsedString = removeStrings(fifthApiItemResponse.desc[0], FifthApiDescriptionTermsToRemove)
    let { category, rarity } = this.parseDescriptionParts(parsedString)
    rarity = rarity.replace('(requires attunement)', '')
    if (!rarity.includes('(') && !rarity.includes('or')) {
      const rarityValues = Object.values(ItemRarity).map((rarity) => rarity.replaceAll('_', ' '))
      rarity = removeStrings(rarity, rarityValues)
    }
    if (!category.includes('(')) {
      category = removeStrings(
        category,
        Object.values(ItemCategory).map((category) => category.replaceAll('-', ' '))
      )
    }
    category = removeLeadingComma(category.trim())
    rarity = removeLeadingComma(rarity.trim())

    category = removeTrailingComma(category.trim())
    rarity = removeTrailingComma(rarity.trim())

    /*let parsedString = removeStrings(fifthApiItemResponse.desc[0], FifthApiDescriptionTermsToRemove)
    parsedString = parsedString.replace('(requires attunement)', '')
    const isAmmunition = fifthApiItemResponse.equipment_category.index === ItemCategory.AMMUNITION
    const isArmor = fifthApiItemResponse.equipment_category.index === ItemCategory.ARMOR
    const rarityValues = Object.values(ItemRarity).map((rarity) => rarity.replaceAll('_', ' '))
    const endsWithRarity = rarityValues.some((element) => {
      return parsedString.endsWith(element)
    })
    if ((!isAmmunition && !isArmor) || !parsedString.includes('(') || endsWithRarity) {
      parsedString = removeStrings(parsedString, rarityValues)
    }

    parsedString = removeStrings(
      parsedString,
      Object.values(ItemCategory).map((category) => category.replaceAll('-', ' '))
    )

    parsedString = parsedString.trim()
    parsedString = removeLeadingComma(parsedString)
    parsedString = removeTrailingComma(parsedString)
    if (!isAmmunition && !isArmor) {
      parsedString = parsedString.replace(/^\((.*)\)$/, '$1')
    }
    parsedString = parsedString.replace('requires attunement', '')
    if (parsedString === 'plate') {
      return ''
    }*/
    //return parsedString.trim()

    const delimiter = category && rarity ? ', ' : ''

    return `${category}${delimiter}${rarity}`
  }

  private parseItemCategoriesFromFifthApiItemResponse = async (fifthApiItemResponse: FifthESRDEquipment): Promise<ItemCategory[]> => {
    let categories = [fifthApiItemResponse.equipment_category.index as ItemCategory]
    if (fifthApiItemResponse.gear_category) {
      categories.push(fifthApiItemResponse.gear_category.index as ItemCategory)
    }

    const secondaryCategoryNames = [
      fifthApiItemResponse.armor_category ? fifthApiItemResponse.armor_category + ' Armor' : '',
      fifthApiItemResponse.tool_category,
      fifthApiItemResponse.vehicle_category,
      fifthApiItemResponse.weapon_category ? fifthApiItemResponse.weapon_category + ' Weapons' : '',
      fifthApiItemResponse.weapon_range ? fifthApiItemResponse.weapon_range + ' Weapons' : ''
    ].filter((category) => !!category)

    if (secondaryCategoryNames.length > 0) {
      const equipmentCategories = await this.fifthApiService.get<FifthESRDAPIReferenceList>(`/equipment-categories`)
      secondaryCategoryNames.forEach((categoryName) => {
        const category = _.find(equipmentCategories.results, { name: categoryName })
        if (category && category.index) {
          categories.push(category.index as ItemCategory)
        }
      })
    }

    return this.fifthApiService.parseCategoryNames(categories)
  }
}
