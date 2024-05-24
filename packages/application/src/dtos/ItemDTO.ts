import DTO from './DTO'
import { ItemResponse, ItemUpdateRequest } from '../interfaces/http/Item'
import _, { capitalize } from 'lodash'
import { isArmor, isWeapon } from '../utils/typeutils'
import { ItemRarity, SECONDARY_CATEGORIES, Source, WeaponDamage, WeaponProperty } from '@dmtool/domain'

type ItemProperties = ItemResponse & {
  damageDiceAmount?: string
  damageDice?: string
  twoHandedDiceAmount?: string
  twoHandedDice?: string
}
export class ItemDTO extends DTO<ItemDTO, ItemProperties> {
  constructor(item: ItemProperties) {
    super({ ...item })

    if (isArmor(this._properties)) {
      this._properties.armorClass = this._properties.armorClass ?? {}
    }
    if (isWeapon(this._properties)) {
      this._properties.damage = this._properties.damage ?? {}
      if (typeof this._properties.damageDiceAmount !== 'string') {
        this._properties.damageDiceAmount = this._properties.damage?.damageDice
          ? this._properties.damage?.damageDice.split('d')[0] || ''
          : undefined
      }
      if (typeof this._properties.damageDice !== 'string') {
        if (this._properties.damage?.damageDice === '1') {
          this._properties.damageDiceAmount = '1'
          this._properties.damageDice = ''
        } else {
          this._properties.damageDice = this._properties.damage?.damageDice
            ? 'd' + this._properties.damage?.damageDice.split('d')[1] || ''
            : undefined
        }
      }
      if (
        (this._properties.properties || []).includes(WeaponProperty.VERSATILE) ||
        (this._properties.properties || []).includes(WeaponProperty.TWO_HANDED)
      ) {
        this._properties.twoHandedDamage = this._properties.twoHandedDamage ?? ({} as WeaponDamage)
        if (typeof this._properties.twoHandedDiceAmount !== 'string') {
          this._properties.twoHandedDiceAmount = this._properties.twoHandedDamage?.damageDice
            ? this._properties.twoHandedDamage?.damageDice.split('d')[0] || ''
            : ''
        }
        if (typeof this._properties.twoHandedDice !== 'string') {
          this._properties.twoHandedDice = this._properties.twoHandedDamage?.damageDice
            ? 'd' + this._properties.twoHandedDamage?.damageDice.split('d')[1] || ''
            : ''
        }
      }
    }
  }

  public get id() {
    return this._properties.id
  }
  public set id(value) {
    this._properties.id = value
  }

  public get url() {
    return this._properties.url
  }
  public set url(value) {
    this._properties.url = value
  }

  public get imageId() {
    return this._properties.imageId
  }
  public set imageId(value) {
    this._properties.imageId = value
  }

  public get name() {
    return this._properties.name
  }
  public set name(value) {
    this._properties.name = value
  }

  public get shortDescription() {
    return this._properties.shortDescription
  }
  public get shortDescription_label() {
    return this._properties.shortDescription ? ` ${this._properties.shortDescription}` : ''
  }
  public set shortDescription(value) {
    this._properties.shortDescription = value
  }

  public get mainDescription() {
    return this._properties.mainDescription
  }
  public set mainDescription(value) {
    this._properties.mainDescription = value
  }

  public get price() {
    return this._properties.price || {}
  }
  public get price_label() {
    return this._properties.price?.quantity ? `${this._properties.price?.quantity} ${this._properties.price?.unit}` : ''
  }
  public set price(value) {
    this._properties.price = value
  }

  public get rarity() {
    return this._properties.rarity || ''
  }
  public get rarity_label() {
    const rarityLabel = this._properties.rarity === ItemRarity.VARIES ? 'Rarity Varies' : this._properties.rarity
    return rarityLabel?.replaceAll('_', ' ') || ''
  }
  public set rarity(value) {
    this._properties.rarity = value
  }

  public get weight() {
    if (typeof this._properties.weight === 'string') {
      this._properties.weight = parseFloat((this._properties.weight as string)?.replace(' lb.', ''))
    }
    return this._properties.weight || null
  }
  public get weight_label() {
    return this._properties.weight ? `${this._properties.weight} lb.` : ''
  }
  public set weight(value: string | number | null) {
    this._properties.weight = typeof value === 'string' ? Number(value) : value
  }

  public get features() {
    return this._properties.features
  }
  public set features(value) {
    this._properties.features = value
  }

  public get categories() {
    return this._properties.categories || []
  }
  public get main_categories_label() {
    return this._properties.categories
      ? this._properties.categories
          ?.filter((category) => !SECONDARY_CATEGORIES.includes(category))
          ?.map((category) => capitalize(category.replaceAll('-', ' ')))
          ?.join(', ')
      : ''
  }
  public get all_categories_label() {
    return this._properties.categories
      ? this._properties.categories?.map((category) => capitalize(category.replaceAll('-', ' '))).join(', ')
      : ''
  }
  public get hasSecondaryCategories() {
    return this.main_categories_label !== this.all_categories_label
  }
  public set categories(value) {
    this._properties.categories = value
  }

  public get requiresAttunement() {
    return this._properties.attunement?.required
  }
  public get requiresAttunement_label() {
    return this._properties.attunement?.required
      ? `(requires attunement${this._properties.attunement?.qualifier ? ' ' + this._properties.attunement?.qualifier : ''})`
      : ''
  }
  public set requiresAttunement(value) {
    this._properties.attunement = this._properties.attunement ?? {}
    this._properties.attunement.required = !!value
  }

  public get attunementQualifier() {
    return this._properties.attunement?.qualifier || ''
  }
  public set attunementQualifier(value) {
    this._properties.attunement = this._properties.attunement ?? {}
    this._properties.attunement.qualifier = value
  }

  public get visibility() {
    return this._properties.visibility
  }
  public get visibility_label() {
    return this._properties.visibility
      ?.replaceAll('_', ' ')
      ?.split(' ')
      ?.map((part) => capitalize(part))
      ?.join(' ')
  }

  public set visibility(value) {
    this._properties.visibility = value
  }

  public get source() {
    return this._properties.source
  }
  public getSource(userId?: string) {
    if (userId && userId === this._properties.createdBy) {
      return Source.MyItem.replaceAll('_', ' ')
    }
    return this._properties.source ? this._properties.source.replaceAll('_', ' ') : ''
  }

  public set source(value) {
    this._properties.source = value
  }

  public get armorClass() {
    return isArmor(this._properties) ? this._properties.armorClass : null
  }
  public get armorClass_label() {
    if (isArmor(this._properties) && this._properties.armorClass) {
      const baseAC = this._properties.armorClass?.base
      const dexBonus = `${this._properties.armorClass?.dexterityBonus ? ` + DEX Modifier` : ''}`
      const maxBonus = `${
        !!this._properties.armorClass?.maximumBonus && dexBonus ? ` (max ${this._properties.armorClass?.maximumBonus})` : ''
      }`
      return baseAC ? `${baseAC}${dexBonus}${maxBonus}` : ''
    } else {
      return ''
    }
  }
  public set armorClass(value) {
    if (isArmor(this._properties) && value) {
      this._properties.armorClass = value
    }
  }

  public get baseArmorClass() {
    return isArmor(this._properties) && this._properties.armorClass ? this._properties.armorClass.base : null
  }
  public set baseArmorClass(value) {
    if (isArmor(this._properties) && value !== null) {
      this._properties.armorClass = this._properties.armorClass ?? {}
      this._properties.armorClass.base = value
    }
  }

  public get armorClassDexterityBonus() {
    return isArmor(this._properties) && this._properties.armorClass ? this._properties.armorClass?.dexterityBonus : null
  }
  public set armorClassDexterityBonus(value) {
    if (isArmor(this._properties) && value !== null) {
      this._properties.armorClass = this._properties.armorClass ?? {}
      this._properties.armorClass.dexterityBonus = value
    }
  }

  public get armorClassMaxBonus() {
    return isArmor(this._properties) && this._properties.armorClass ? this._properties.armorClass?.maximumBonus : null
  }
  public set armorClassMaxBonus(value) {
    if (isArmor(this._properties) && value !== null) {
      this._properties.armorClass = this._properties.armorClass ?? {}
      this._properties.armorClass.maximumBonus = value
    }
  }

  public get strengthMinimum() {
    return isArmor(this._properties) ? this._properties.strengthMinimum : null
  }
  public set strengthMinimum(value) {
    if (isArmor(this._properties) && value !== null) {
      this._properties.strengthMinimum = value
    }
  }

  public get stealthDisadvantage() {
    return isArmor(this._properties) ? this._properties.stealthDisadvantage : null
  }
  public set stealthDisadvantage(value) {
    if (isArmor(this._properties) && value !== null) {
      this._properties.stealthDisadvantage = value
    }
  }

  public get damage() {
    return isWeapon(this._properties) ? this._properties.damage : null
  }
  public get damage_label() {
    if (isWeapon(this._properties) && this._properties.damage) {
      if (this.damageDiceAmount === '1' || (this.damageDiceAmount && this.damageDice)) {
        return `${this.damageDiceAmount}${this.damageDice}`
      } else {
        return ''
      }
    } else {
      return ''
    }
  }
  public get damage_full_label() {
    if (isWeapon(this._properties) && this._properties.damage) {
      if (this.damageDiceAmount === '1' || (this.damageDiceAmount && this.damageDice)) {
        return `${this.damage_label} ${capitalize(this._properties.damage?.damageType || '')} ${this._properties.damage?.qualifier || ''}`
      } else {
        return ''
      }
    } else {
      return ''
    }
  }
  public set damage(value) {
    if (isWeapon(this._properties) && value !== null) {
      this._properties.damage = value
    }
  }
  public get damageDiceAmount() {
    return isWeapon(this._properties) ? this._properties.damageDiceAmount || '' : ''
  }
  public set damageDiceAmount(value: string) {
    if (isWeapon(this._properties) && value !== null) {
      this._properties.damageDiceAmount = value
      if (this.damageDice) {
        this._properties.damage = this._properties.damage ?? {}
        this._properties.damage.damageDice = this.damage_label
      }
    }
  }
  public get damageDice() {
    return isWeapon(this._properties) ? this._properties.damageDice || '' : ''
  }
  public set damageDice(value: string) {
    if (isWeapon(this._properties) && value !== null) {
      this._properties.damageDice = value
      if (this.damageDiceAmount) {
        this._properties.damage = this._properties.damage ?? {}
        this._properties.damage.damageDice = this.damage_label
      }
    }
  }

  public get damageQualifier() {
    return isWeapon(this._properties) ? this._properties.damage?.qualifier || '' : ''
  }
  public set damageQualifier(value) {
    if (isWeapon(this._properties) && value !== null) {
      this._properties.damage = this._properties.damage ?? {}
      this._properties.damage.qualifier = value
    }
  }

  public get twoHandedDamage() {
    return isWeapon(this._properties) && this.hasTwoHandedProperty() ? this._properties.twoHandedDamage : null
  }
  public set twoHandedDamage(value) {
    if (isWeapon(this._properties) && this.hasTwoHandedProperty() && value !== null) {
      this._properties.twoHandedDamage = value
    }
  }
  public get twoHandedDamage_label() {
    if (isWeapon(this._properties) && this.hasTwoHandedProperty() && this._properties.damage) {
      return this.twoHandedDiceAmount && this.twoHandedDice ? `${this.twoHandedDiceAmount}${this.twoHandedDice}` : ''
    } else {
      return ''
    }
  }
  public get twoHandedDamage_full_label() {
    if (isWeapon(this._properties) && this.hasTwoHandedProperty() && this._properties.damage) {
      return `${
        this.twoHandedDamage_label
          ? ` (${this.twoHandedDamage_label} ${capitalize(this._properties.twoHandedDamage?.damageType || '')} ${
              this._properties.twoHandedDamage?.qualifier || ''
            })`
          : ''
      }`
    } else {
      return ''
    }
  }

  public get twoHandedDiceAmount() {
    return this.hasTwoHandedProperty() ? this._properties.twoHandedDiceAmount || '' : ''
  }
  public set twoHandedDiceAmount(value: string) {
    if (isWeapon(this._properties) && this.hasTwoHandedProperty() && value !== null) {
      this._properties.twoHandedDiceAmount = value
      if (this.twoHandedDamage && this._properties.twoHandedDamage) {
        this._properties.twoHandedDamage = this._properties.twoHandedDamage ?? {}
        this._properties.twoHandedDamage.damageDice = this.twoHandedDamage_label
      }
    }
  }
  public get twoHandedDice() {
    return this.hasTwoHandedProperty() ? this._properties.twoHandedDice || '' : ''
  }
  public set twoHandedDice(value: string) {
    if (isWeapon(this._properties) && this.hasTwoHandedProperty() && value !== null) {
      this._properties.twoHandedDice = value
      if (this.twoHandedDiceAmount && this._properties.twoHandedDamage) {
        this._properties.twoHandedDamage = this._properties.twoHandedDamage ?? {}
        this._properties.twoHandedDamage.damageDice = this.twoHandedDamage_label
      }
    }
  }

  public get twoHandedDamageQualifier() {
    return isWeapon(this._properties) ? this._properties.twoHandedDamage?.qualifier || '' : ''
  }
  public set twoHandedDamageQualifier(value) {
    if (isWeapon(this._properties) && this._properties.twoHandedDamage && value !== null) {
      this._properties.twoHandedDamage = this._properties.twoHandedDamage ?? {}
      this._properties.twoHandedDamage.qualifier = value
    }
  }

  public get useRange() {
    return isWeapon(this._properties) ? this._properties.useRange : null
  }
  public get useRange_label() {
    if (isWeapon(this._properties) && (this._properties.useRange?.normal || this._properties.useRange?.long)) {
      return `${this._properties.useRange.normal}${this._properties.useRange?.long ? '/' + this._properties.useRange.long : ''} ft.`
    }
    return ''
  }
  public get useRangeNormal() {
    return isWeapon(this._properties) ? this._properties.useRange?.normal : null
  }
  public set useRangeNormal(value) {
    if (isWeapon(this._properties) && this._properties.useRange && value != null) {
      this._properties.useRange = this._properties.useRange ?? {}
      this._properties.useRange.normal = value
    }
  }
  public get useRangeLong() {
    return isWeapon(this._properties) ? this._properties.useRange?.long : null
  }
  public set useRangeLong(value) {
    if (isWeapon(this._properties) && this._properties.useRange && value != null) {
      this._properties.useRange = this._properties.useRange ?? {}
      this._properties.useRange.long = value
    }
  }

  public get throwRange() {
    return this._properties.throwRange ? this._properties.throwRange : null
  }
  public get throwRange_label() {
    if (
      isWeapon(this._properties) &&
      this.hasThrownProperty() &&
      (this._properties.throwRange?.normal || this._properties.throwRange?.long)
    ) {
      return `${this._properties.throwRange?.normal}${this._properties.throwRange?.long ? '/' + this._properties.throwRange?.long : ''} ft.`
    }
    return ''
  }
  public get throwRangeNormal() {
    return this._properties.throwRange ? this._properties.throwRange?.normal : null
  }
  public set throwRangeNormal(value) {
    if (this._properties.throwRange && value !== null) {
      this._properties.throwRange = this._properties.throwRange ?? {}
      this._properties.throwRange.normal = value
    }
  }

  public get throwRangeLong() {
    return this._properties.throwRange ? this._properties.throwRange.long : null
  }
  public set throwRangeLong(value) {
    if (this._properties.throwRange && value !== null) {
      this._properties.throwRange = this._properties.throwRange ?? {}
      this._properties.throwRange.long = value
    }
  }

  public get properties() {
    return isArmor(this._properties) || isWeapon(this._properties) ? this._properties.properties : []
  }
  public get properties_label() {
    if (isArmor(this._properties) || (isWeapon(this._properties) && this._properties.properties)) {
      return this._properties.properties?.map((property) => capitalize(property)).join(', ')
    } else {
      return ''
    }
  }
  public set properties(value) {
    if ((isArmor(this._properties) || isWeapon(this._properties)) && value !== null) {
      this._properties.properties = value
    }
  }

  public get createdBy() {
    return this._properties.createdBy
  }
  public set createdBy(value) {
    this._properties.createdBy = value
  }

  public get createdByUserName() {
    return this._properties.createdByUserName || ''
  }
  public getCreatedByUserName(userId?: string) {
    if (userId && this._properties.createdByUserName && userId === this._properties.createdBy) {
      return `${this._properties.createdByUserName} (You)`
    }
    return this._properties.createdByUserName || ''
  }

  get createdAt() {
    return this._properties.createdAt
  }
  public set createdAt(value) {
    this._properties.createdAt = value
  }

  get updatedAt() {
    return this._properties.updatedAt
  }
  public set updatedAt(value) {
    this._properties.updatedAt = value
  }

  public clone(attributes?: Partial<ItemProperties>) {
    if (attributes) {
      const cloneAttrs = {
        ...this.toJSON(),
        ...attributes
      }
      return new ItemDTO(cloneAttrs)
    } else {
      return new ItemDTO({ ...this.toJSON() })
    }
  }

  hasThrownProperty() {
    let hasThrownProperty = false
    if (isWeapon(this._properties)) {
      hasThrownProperty = this._properties.properties?.includes(WeaponProperty.THROWN)
    }
    return hasThrownProperty
  }

  hasTwoHandedProperty() {
    let hasTwoHandedProperty = false
    if (isWeapon(this._properties)) {
      hasTwoHandedProperty =
        this._properties.properties?.includes(WeaponProperty.VERSATILE) || this._properties.properties?.includes(WeaponProperty.TWO_HANDED)
    }
    return hasTwoHandedProperty
  }

  isEqual(otherItem: ItemDTO | object | null): boolean {
    if (otherItem === null) {
      return false
    }
    return JSON.stringify(this) === JSON.stringify(otherItem)
  }

  toJSON(): ItemProperties {
    return _.cloneDeep(this._properties)
  }

  toUpdateRequestItemJSON(): ItemUpdateRequest['item'] {
    let properties = _.omit(this._properties, [
      'damageDiceAmount',
      'damageDice',
      'twoHandedDiceAmount',
      'twoHandedDice',
      'unique'
    ]) as unknown as ItemUpdateRequest['item']

    properties.weight = properties.weight ?? null
    properties.properties = properties.properties ?? []
    properties.stealthDisadvantage = properties.stealthDisadvantage ?? false
    properties.strengthMinimum = properties.strengthMinimum ?? ''

    properties.price = {
      ...{ quantity: '', unit: '' },
      ...properties.price
    }

    properties.armorClass = {
      ...{ base: '', dexterityBonus: false },
      ...properties.armorClass
    }

    properties.damage = {
      ...{ damageDice: '', damageType: '' },
      ...properties.damage
    }

    properties.twoHandedDamage = {
      ...{ damageDice: '', damageType: '' },
      ...properties.twoHandedDamage
    }

    properties.useRange = {
      ...{ normal: '', long: '' },
      ...properties.useRange
    }

    properties.throwRange = {
      ...{ normal: '', long: '' },
      ...properties.throwRange
    }

    if (this.hasTwoHandedProperty()) {
      properties.twoHandedDamage = {
        ...{ damageDice: '', damageType: '' },
        ...properties.twoHandedDamage
      }
    }

    return _.omit(properties as ItemUpdateRequest['item'], 'createdByUserName')
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default ItemDTO
