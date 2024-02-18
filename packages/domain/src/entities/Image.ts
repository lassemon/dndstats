import { EntityType } from '../enums/EntityType'
import { Entity } from './Entity'

export interface ImageMetadata extends Entity {
  fileName: string
  mimeType: string
  size: number
  description?: string
  ownerId?: string
  ownerType?: `${EntityType}`
}

export interface BaseImage {
  metadata: ImageMetadata
}

export interface Image extends BaseImage {
  base64: string
}
