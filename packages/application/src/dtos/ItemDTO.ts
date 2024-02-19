import { Item } from '@dmtool/domain'
import DTO from './DTO'

export class ItemDTO extends DTO<ItemDTO, Item> {
  constructor(item: Item) {
    super(item)
  }

  public get id() {
    return this._properties.id
  }
  public set id(value) {
    this._properties.id = value
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
    return `${this._properties.shortDescription}${this._properties.rarity ? ', ' + this._properties.rarity.replace('_', ' ') : ''}`
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
    return this._properties.price || ''
  }
  public set price(value) {
    this._properties.price = value
  }

  public get rarity() {
    return this._properties.rarity || ''
  }
  public set rarity(value) {
    this._properties.rarity = value
  }

  public get weight() {
    return this._properties.weight || ''
  }
  public set weight(value) {
    this._properties.weight = value
  }

  public get features() {
    return this._properties.features
  }
  public set features(value) {
    this._properties.features = value
  }

  public get visibility() {
    return this._properties.visibility
  }
  public set visibility(value) {
    this._properties.visibility = value
  }

  public get source() {
    return this._properties.source
  }
  public set source(value) {
    this._properties.source = value
  }

  public get createdBy() {
    return this._properties.createdBy
  }
  public set createdBy(value) {
    this._properties.createdBy = value
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

  public clone(attributes?: Partial<Item>) {
    if (attributes) {
      const cloneAttrs = {
        ...this.toJSON(),
        ...attributes
      }
      return new ItemDTO(cloneAttrs)
    } else {
      return new ItemDTO(this.toJSON())
    }
  }

  isEqual(otherItem: ItemDTO | object | null): boolean {
    if (otherItem === null) {
      return false
    }
    return JSON.stringify(this) === JSON.stringify(otherItem)
  }

  toJSON(): Item {
    return this._properties
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default ItemDTO
