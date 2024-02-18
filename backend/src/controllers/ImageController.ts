import { Body, Controller, Get, Middlewares, Post, Request, Response, Route, SuccessResponse, Tags } from 'tsoa'
import { Image } from '@dmtool/domain'
import path from 'path'
import { readFile } from 'fs/promises'
import { ImageService } from '@dmtool/application'
import { SaveImageUseCase } from '/useCases/SaveImageUseCase'
import { ImageProcessingService, ImageStorageService } from '@dmtool/infrastructure'
import ImageRepository from '/infrastructure/repositories/ImageRepository'
import { throwIllegalArgument, throwUnknownError } from '/utils/errorUtil'
import ApiError from '/domain/errors/ApiError'
import { AuthenticatedRequest } from '/infrastructure/entities/AuthenticatedRequest'
import Authentication from '/security/Authentication'
import passport from 'passport'

const imagesBasePath = process.env.IMAGES_BASE_PATH || './images'

const authentication = new Authentication(passport)

const imageService = new ImageService()
const imageProcessingService = new ImageProcessingService()
const imageStorageService = new ImageStorageService()
const imageRepository = new ImageRepository()
const saveImageUseCase = new SaveImageUseCase(imageService, imageProcessingService, imageStorageService, imageRepository)

@Route('/')
export class ImageController extends Controller {
  @Tags('Image')
  @Get('image/{imageId}')
  @Response(404, 'Image not found')
  public async get(imageId?: string): Promise<any> {
    if (imageId) {
      const dbImage = await imageRepository.getById(imageId)
      const fileName = dbImage.metadata.fileName

      const imagePath = path.resolve(imagesBasePath, fileName)
      const imageBuffer = await readFile(imagePath)
      const imageBase64 = imageBuffer.toString('base64')

      const image: Image = {
        ...dbImage,
        base64: `data:image/png;base64,${imageBase64}`
      }

      if (!image.metadata.fileName) {
        this.setStatus(404)
        return
      }

      return image
    } else {
      throw new ApiError(404, 'NotFound')
    }
  }

  @Tags('Image')
  @SuccessResponse('201', 'Created')
  @Middlewares(authentication.authenticationMiddleware())
  @Post('image')
  public async uploadImage(@Request() request: AuthenticatedRequest, @Body() requestBody: Image): Promise<Image> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    return await saveImageUseCase.execute({ image: requestBody, unknownError: throwUnknownError, invalidArgument: throwIllegalArgument })
  }
}
