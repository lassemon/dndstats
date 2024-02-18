import { Body, Controller, Delete, Get, Middlewares, Path, Put, Request, Route, SuccessResponse, Tags } from 'tsoa'
import passport from 'passport'
import Authentication from '/security/Authentication'
import express from 'express'
import ApiError from '/domain/errors/ApiError'
import { Item, User } from '@dmtool/domain'
import ItemRepository from '/infrastructure/repositories/ItemRepository'
import { AuthenticatedRequest } from '/infrastructure/entities/AuthenticatedRequest'
import { ITEM_DEFAULTS, ImageService, ItemUpdateRequest, ItemUpdateResponse } from '@dmtool/application'
import { ImageProcessingService, ImageStorageService } from '@dmtool/infrastructure'
import ImageRepository from '/infrastructure/repositories/ImageRepository'
import { SaveImageUseCase } from '/useCases/SaveImageUseCase'
import { SaveItemUseCase } from '/useCases/SaveItemUseCase'
import { throwIllegalArgument, throwUnknownError } from '/utils/errorUtil'
import { RemoveImageFromItemUseCase } from '/useCases/RemoveImageFromItemUseCase'
const authentication = new Authentication(passport)

const imageService = new ImageService()
const imageProcessingService = new ImageProcessingService()
const imageStorageService = new ImageStorageService()
const imageRepository = new ImageRepository()
const saveImageUseCase = new SaveImageUseCase(imageService, imageProcessingService, imageStorageService, imageRepository)
const itemRepository = new ItemRepository()

const removeImageFromItemUseCase = new RemoveImageFromItemUseCase(itemRepository, imageStorageService, imageRepository)
const saveItemUseCase = new SaveItemUseCase(itemRepository, saveImageUseCase, removeImageFromItemUseCase)

@Route('/')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class ItemController extends Controller {
  @Tags('Item')
  @Get('items/')
  public async getAll(): Promise<Item[]> {
    return await itemRepository.getAll()
  }

  @Tags('Item')
  @Get('items/{userId}')
  public async getAllForUser(@Request() request: express.Request, @Path() userId?: string): Promise<Item[]> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }
    return await itemRepository.getAllForUser((request.user as User).id)
  }

  @Tags('Item')
  @Get('item/')
  public async get(@Request() request: express.Request): Promise<Item> {
    console.log('getting item isAuthenticated', request?.isAuthenticated())
    return await itemRepository.getById(ITEM_DEFAULTS.DEFAULT_ITEM_ID)
  }

  @Tags('Item')
  @Get('item/{itemId}')
  public async getItem(@Request() request: express.Request, @Path() itemId: string): Promise<Item> {
    console.log('getting item isAuthenticated', request?.isAuthenticated())

    return await itemRepository.getById(itemId)
  }

  @Tags('Item')
  @SuccessResponse('201', 'Created')
  @Middlewares(authentication.authenticationMiddleware())
  @Put('item/')
  public async update(@Request() request: AuthenticatedRequest, @Body() requestBody: ItemUpdateRequest): Promise<ItemUpdateResponse> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    console.log('creating item isAuthenticated', request?.isAuthenticated())
    console.log('creating item user', request?.user)
    if (!request?.isAuthenticated()) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }
    return await saveItemUseCase.execute({
      user: request.user as User,
      item: requestBody.item,
      image: requestBody.image,
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })
  }

  @Tags('Item')
  @SuccessResponse('200', 'OK')
  @Delete('item/{itemId}')
  public async deleteIem(@Request() request: express.Request, @Path() itemId: string): Promise<Item> {
    console.log('getting item isAuthenticated', request?.isAuthenticated())
    if (!request?.isAuthenticated() || !request.user) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }

    const itemToDelete = await itemRepository.getById(itemId)

    if (itemToDelete.createdBy !== (request.user as User).id) {
      throw new ApiError(401, 'Unauthorized', 'This item was not created by you')
    }

    if (itemToDelete) {
      await itemRepository.delete(itemToDelete.id)
      return itemToDelete
    } else {
      throw new ApiError(404, 'NotFound')
    }
  }
}
