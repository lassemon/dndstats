import { Body, Controller, Delete, Get, Middlewares, Path, Put, Request, Route, SuccessResponse, Tags } from 'tsoa'
import passport from 'passport'
import Authentication from '/security/Authentication'
import express from 'express'
import ApiError from '/domain/errors/ApiError'
import { Item, Source, User } from '@dmtool/domain'
import ItemRepository from '/infrastructure/repositories/ItemRepository'
import { AuthenticatedRequest } from '/infrastructure/entities/AuthenticatedRequest'
import { ITEM_DEFAULTS, ImageService, ItemUpdateRequest, ItemUpdateResponse } from '@dmtool/application'
import { ImageProcessingService, ImageStorageService } from '@dmtool/infrastructure'
import ImageRepository from '/infrastructure/repositories/ImageRepository'
import { SaveImageUseCase } from '/useCases/SaveImageUseCase'
import { SaveItemUseCase } from '/useCases/SaveItemUseCase'
import { throwIllegalArgument, throwUnknownError } from '/utils/errorUtil'
import { RemoveImageFromItemUseCase } from '/useCases/RemoveImageFromItemUseCase'
import { DeleteItemUseCase } from '/useCases/DeleteItemUseCase'
const authentication = new Authentication(passport)

const imageService = new ImageService()
const imageProcessingService = new ImageProcessingService()
const imageStorageService = new ImageStorageService()
const imageRepository = new ImageRepository()
const saveImageUseCase = new SaveImageUseCase(imageService, imageProcessingService, imageStorageService, imageRepository)
const itemRepository = new ItemRepository()

const removeImageFromItemUseCase = new RemoveImageFromItemUseCase(itemRepository, imageStorageService, imageRepository)
const saveItemUseCase = new SaveItemUseCase(itemRepository, saveImageUseCase, removeImageFromItemUseCase)

const deleteItemUseCase = new DeleteItemUseCase(itemRepository, removeImageFromItemUseCase)

@Route('/')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class ItemController extends Controller {
  @Tags('Item')
  @Get('items/')
  public async getAll(@Request() request: express.Request): Promise<Item[]> {
    if (request?.isAuthenticated()) {
      return await itemRepository.getAllVisibleForLoggedInUser()
    } else {
      return await itemRepository.getAll()
    }
  }

  @Tags('Item')
  @Get('items/{userId}')
  public async getAllForUser(@Request() request: express.Request, @Path() userId?: string): Promise<Item[]> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }
    return (await itemRepository.getAllForUser((request.user as User).id)).map((item) => {
      return {
        ...item,
        source: item.source === Source.HomeBrew ? Source.MyItem : item.source
      }
    })
  }

  @Tags('Item')
  @Get('item/')
  public async get(@Request() request: express.Request): Promise<Item> {
    return await itemRepository.getById(ITEM_DEFAULTS.DEFAULT_ITEM_ID)
  }

  @Tags('Item')
  @Get('item/{itemId}')
  public async getItem(@Request() request: express.Request, @Path() itemId: string): Promise<Item> {
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
    if (!request?.isAuthenticated()) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }

    if (requestBody.item.id === 'defaultItem') {
      throw new ApiError(403, 'Unauthorized', 'Cannot modify the default item.')
    }

    return await saveItemUseCase.execute({
      userId: (request.user as User).id,
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
    if (!request?.isAuthenticated() || !request.user) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }

    const itemToDelete = await itemRepository.getById(itemId)

    if (itemToDelete.createdBy !== (request.user as User).id) {
      throw new ApiError(401, 'Unauthorized', 'This item was not created by you')
    }

    if (itemToDelete) {
      return await deleteItemUseCase.execute({
        itemId: itemToDelete.id,
        userId: (request.user as User).id,
        unknownError: throwUnknownError,
        invalidArgument: throwIllegalArgument
      })
    } else {
      throw new ApiError(404, 'NotFound')
    }
  }
}
