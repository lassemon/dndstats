import DTO from './DTO'
import { ItemResponse } from '../interfaces/http/Item'
import _, { capitalize } from 'lodash'

export class ItemDTO extends DTO<ItemDTO, ItemResponse> {
  constructor(item: ItemResponse) {
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
    return this._properties.price || {}
  }
  public get price_label() {
    return this._properties.price.quantity ? `${this._properties.price.quantity} ${this._properties.price.unit}` : ''
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
    return this._properties.weight || null
  }
  public get weight_label() {
    return this._properties.weight ? `${this._properties.weight} lb.` : ''
  }
  public set weight(value: string | number | null) {
    this._properties.weight = typeof value === 'string' ? parseInt(value) : value
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
  public get visibility_label() {
    return this._properties.visibility
      .replaceAll('_', ' ')
      .split(' ')
      .map((part) => capitalize(part))
      .join(' ')
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

  public get createdByUserName() {
    return this._properties.createdByUserName
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

  public clone(attributes?: Partial<ItemResponse>) {
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

  toJSON(): ItemResponse {
    return this._properties
  }

  toUpdateRequestItemJSON() {
    return _.omit(this._properties, 'createdByUserName')
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default ItemDTO
