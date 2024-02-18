import { BaseImage, ImageMetadata } from '@dmtool/domain/src/entities/Image'
import connection from '../database/connection'
import { DateTime } from 'luxon'
import ApiError from '/domain/errors/ApiError'
import { uuid } from '@dmtool/common'
import UnknownError from '/domain/errors/UnknownError'
import { Logger } from '@dmtool/common'
import { DatabaseImageRepositoryInterface, ITEM_DEFAULTS } from '@dmtool/application'

const logger = new Logger('ImageRepository')

class ImageRepository implements DatabaseImageRepositoryInterface {
  async getById(id: string): Promise<BaseImage> {
    const imageMetadata = await connection.select('*').from<any, ImageMetadata>('images').where('id', id).first()
    if (!imageMetadata) {
      throw new ApiError(404, 'NotFound', `Image metadata with "${id}" was not found.`)
    }
    return { metadata: imageMetadata }
  }

  async save(image: BaseImage) {
    const updatedAt = DateTime.now().toUnixInteger()
    const metadataToInsert: ImageMetadata = {
      ...image.metadata,
      id: image.metadata.id === ITEM_DEFAULTS.DEFAULT_ITEM_IMAGE_ID ? uuid() : image.metadata.id, // don't allow overwriting of the default image
      updatedAt
    }
    try {
      await connection<any, ImageMetadata>('images').insert(metadataToInsert).onConflict('name').merge() // mariadb does not return inserted object
    } catch (error) {
      logger.error((error as any)?.message)
      throw new UnknownError(500, 'UnknownError')
    }
    return { metadata: metadataToInsert }
  }
  async delete(id: string) {
    try {
      await connection<any, ImageMetadata>('images').where('id', id).delete()
    } catch (error) {
      logger.error((error as any)?.message)
      throw new UnknownError(500, 'UnknownError')
    }
  }
}

export default ImageRepository
