import { UseCaseInterface, UseCaseOptionsInterface, ImageServiceInterface, DatabaseImageRepositoryInterface } from '@dmtool/application'
import { Image } from '@dmtool/domain'
import { ImageProcessingServiceInterface, ImageStorageServiceInterface } from '@dmtool/infrastructure'

export interface SaveImageUseCaseOptions extends UseCaseOptionsInterface {
  image: Image
  previousFileName?: string
}

export type SaveImageUseCaseInterface = UseCaseInterface<SaveImageUseCaseOptions, Image>

export class SaveImageUseCase implements SaveImageUseCaseInterface {
  constructor(
    private readonly imageService: ImageServiceInterface,
    private readonly imageProcessingService: ImageProcessingServiceInterface,
    private readonly imageStorageService: ImageStorageServiceInterface,
    private readonly imageRepository: DatabaseImageRepositoryInterface
  ) {}

  async execute({ image, previousFileName }: SaveImageUseCaseOptions): Promise<Image> {
    const imageBuffer = this.imageService.convertBase64ImageToBuffer(image.base64)
    const resizedBuffer = await this.imageProcessingService.resizeImage(imageBuffer, { width: 320 })
    const mimeType = await this.imageProcessingService.getBufferMimeType(resizedBuffer)
    if (mimeType) {
      image.metadata.mimeType = mimeType
    }
    const fileNameToSave = this.imageService.parseImageFilename(image.metadata)
    try {
      const previousImage = await this.imageRepository.getById(image.metadata.id)
      await this.imageStorageService.deleteImageFromFileSystem(previousImage.metadata.fileName)
      await this.imageRepository.delete(image.metadata.id)
    } catch (error) {
      // fail silently if previous image not found
    }
    this.imageStorageService.writeImageBufferToFile(resizedBuffer, fileNameToSave, previousFileName)
    await this.imageRepository.save({ ...image, metadata: { ...image.metadata, fileName: fileNameToSave } })
    return {
      ...image,
      base64: this.imageService.convertBufferToBase64Image(resizedBuffer, image.metadata)
    }
  }
}
