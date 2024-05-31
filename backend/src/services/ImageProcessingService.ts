import fs from 'fs'
import { ImageProcessingServiceInterface } from './ImageProcessingServiceInterface'
import Jimp from 'jimp'
import webp from 'webp-converter'
import fileType from 'file-type'

const imagesBasePath = process.env.IMAGES_BASE_PATH || './images'

webp.grant_permission()

export class ImageProcessingService implements ImageProcessingServiceInterface {
  async resizeImage(buffer: Buffer, resizeOptions: { width: number }) {
    try {
      // Detect the MIME type of the image
      console.log('====================fileType', fileType)
      const type = await fileType.fromBuffer(buffer)

      if (type && type.mime === 'image/webp') {
        // Process as WebP
        const inputWebpPath = `${imagesBasePath}/temp/temp.webp` // Consider using a unique filename or a temporary directory
        const outputPngPath = `${imagesBasePath}/temp/temp.png`

        // Write the WebP image to a temporary file
        await fs.promises.writeFile(inputWebpPath, buffer)

        // Convert WebP to PNG
        await webp.dwebp(inputWebpPath, outputPngPath, '-o')

        // Read the converted PNG file into a buffer
        const pngBuffer = await fs.promises.readFile(outputPngPath)

        // Resize the PNG buffer using Jimp
        const image = await Jimp.read(pngBuffer)
        await image.resize(resizeOptions.width, Jimp.AUTO)
        const resizedBuffer = await image.getBufferAsync(Jimp.MIME_PNG)

        // Cleanup temporary files
        await fs.promises.unlink(inputWebpPath)
        await fs.promises.unlink(outputPngPath)

        return resizedBuffer
      } else {
        // Process non-WebP images directly with Jimp
        const image = await Jimp.read(buffer)
        await image.resize(resizeOptions.width, Jimp.AUTO)
        return await image.getBufferAsync(Jimp.MIME_PNG)
      }
    } catch (error) {
      console.error('Error processing image:', error)
      throw new Error('Failed to process image')
    }
  }

  async getBufferMimeType(buffer: Buffer) {
    const extractedFileType = await fileType.fromBuffer(buffer)
    return extractedFileType?.mime
  }
}
