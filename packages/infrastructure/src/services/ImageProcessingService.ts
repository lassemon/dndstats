import sharp, { ResizeOptions } from 'sharp'
import { ImageProcessingServiceInterface } from './ImageProcessingServiceInterface'

export class ImageProcessingService implements ImageProcessingServiceInterface {
  async resizeImage(buffer: Buffer, resizeOptions: ResizeOptions): Promise<Buffer> {
    return await sharp(buffer).resize(resizeOptions).toBuffer()
  }
}
