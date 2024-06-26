import fs from 'fs'
import { ImageStorageServiceInterface } from './ImageStorageServiceInterface'
import { Logger } from '@dmtool/common'
import sanitize from 'sanitize-filename'

const logger = new Logger('ImageStorageService')

const imagesBasePath = process.env.IMAGES_BASE_PATH || './images'

export class ImageStorageService implements ImageStorageServiceInterface {
  async deleteImageFromFileSystem(fileName: string) {
    const unlinkPath = `${imagesBasePath}/${fileName}`
    fs.unlink(unlinkPath, (err) => {
      if (err) {
        logger.error('Error removing the file:', err)
        return
      }
      logger.debug('File removed successfully', fileName)
    })
  }

  writeImageBufferToFile(imageBuffer: Buffer, fileName: string) {
    const sanitizedFileName = sanitize(fileName)
    const outputPath = `${imagesBasePath}/${sanitizedFileName}`
    fs.writeFile(outputPath, imageBuffer, (err) => {
      if (err) {
        console.error('Failed to save the image file:', err)
        return
      }
    })
  }
}
