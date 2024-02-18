import { ImageMetadata } from '@dmtool/domain'
import { ImageServiceInterface } from './ImageServiceInterface'
import mime from 'mime-types'

export class ImageService implements ImageServiceInterface {
  convertBase64ImageToBuffer(base64ImageData: string) {
    // Extract content type and base64 payload from the base64 image string
    const matches = base64ImageData.match(/^data:(.+);base64,(.*)$/)
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image data')
    }

    //const contentType = matches[1];
    const base64Payload = matches[2]
    return Buffer.from(base64Payload, 'base64')
  }

  convertBufferToBase64Image(imageBuffer: Buffer, metadata: ImageMetadata) {
    return `data:${metadata.mimeType};base64,${imageBuffer.toString('base64')}`
  }

  parseImageFilename(metadata: ImageMetadata) {
    const fileExtension = mime.extension(metadata.mimeType)
    return `${metadata.ownerType}_${metadata.createdBy}_${metadata.fileName}.${fileExtension}`
  }
}
