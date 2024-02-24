import { EntityType, Image, ImageMetadata, Source, Visibility } from '@dmtool/domain'
import DTO from './DTO'
import { unixtimeNow, uuid } from '@dmtool/common'
import { ITEM_DEFAULTS } from '../enums/defaults/ItemDefaults'

interface ImageDTOProperties extends ImageMetadata {
  base64: string
}

export class ImageDTO extends DTO<ImageDTO, ImageDTOProperties> {
  constructor(image: Image) {
    super({ ...image.metadata, base64: image.base64 })
  }

  public get id() {
    return this._properties.id
  }
  public set id(value) {
    this._properties.id = value
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

  public get fileName() {
    return this._properties.fileName
  }
  public set fileName(value: string) {
    this._properties.fileName = value.replaceAll(' ', '').toLowerCase()
  }

  public get mimeType() {
    return this._properties.mimeType
  }
  public set mimeType(value) {
    this._properties.mimeType = value
  }

  public get size() {
    return this._properties.size
  }
  public set size(value) {
    this._properties.size = value
  }

  public get description() {
    return this._properties.description
  }
  public set description(value) {
    this._properties.description = value
  }

  public get ownerId() {
    return this._properties.ownerId
  }
  public set ownerId(value) {
    this._properties.ownerId = value
  }

  public get ownerType() {
    return this._properties.ownerType
  }
  public set ownerType(value) {
    this._properties.ownerType = value
  }

  public get createdBy() {
    return this._properties.createdBy
  }
  public set createdBy(value) {
    this._properties.createdBy = value
  }

  public get createdAt() {
    return this._properties.createdAt
  }
  public set createdAt(value) {
    this._properties.createdAt = value
  }

  public get updatedAt() {
    return this._properties.updatedAt
  }
  public set updatedAt(value) {
    this._properties.updatedAt = value
  }

  public get base64() {
    return this._properties.base64
  }
  public set base64(value) {
    this._properties.base64 = value
  }

  public clone(attributes?: Partial<Image>) {
    if (attributes) {
      const cloneAttrs = {
        ...this.toJSON(),
        ...attributes
      }
      return new ImageDTO(cloneAttrs)
    } else {
      return new ImageDTO(this.toJSON())
    }
  }

  isEqual(otherImage: ImageDTO | object | null): boolean {
    if (otherImage === null) {
      return false
    }
    return JSON.stringify(this) === JSON.stringify(otherImage)
  }

  private isSavingDefaultImage() {
    return this._properties.id === ITEM_DEFAULTS.DEFAULT_ITEM_IMAGE_ID
  }

  parseForSaving(imageBase64?: string): Image {
    let newImageId = this._properties.id
    if (this.isSavingDefaultImage()) {
      newImageId = uuid()
    }

    const unixtime = unixtimeNow()
    return {
      metadata: {
        id: newImageId || uuid(),
        createdAt: this.createdAt || unixtime,
        visibility: Visibility.PUBLIC,
        fileName: this.fileName,
        size: this.size,
        mimeType: this.mimeType,
        createdBy: this.createdBy,
        updatedAt: unixtime,
        source: this.source,
        ownerId: this.ownerId,
        ownerType: EntityType.ITEM
      },
      base64: imageBase64 || this.base64
    }
  }

  toJSON(): Image {
    return { metadata: this._properties, base64: this._properties.base64 }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}
