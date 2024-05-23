import { Body, Controller, Delete, Get, Middlewares, Path, Put, Queries, Query, Request, Route, SuccessResponse, Tags } from 'tsoa'
import passport from 'passport'
import Authentication from '/security/Authentication'
import express from 'express'
import { ApiError, ItemSortableKeys, Source, User, Visibility } from '@dmtool/domain'
import ItemRepository from '/infrastructure/repositories/ItemRepository'
import { AuthenticatedRequest } from '/infrastructure/entities/AuthenticatedRequest'
import {
  ITEM_DEFAULTS,
  ItemResponse,
  ItemSearchRequest,
  ItemSearchResponse,
  ItemService,
  ItemUpdateRequest,
  ItemUpdateResponse,
  UserService,
  isArmor,
  isWeapon
} from '@dmtool/application'
import ImageRepository from '/infrastructure/repositories/ImageRepository'
import { SaveImageUseCase } from '/useCases/SaveImageUseCase'
import { SaveItemUseCase } from '/useCases/SaveItemUseCase'
import { throwIllegalArgument, throwUnknownError } from '/utils/errorUtil'
import { RemoveImageFromItemUseCase } from '/useCases/RemoveImageFromItemUseCase'
import { DeleteItemUseCase } from '/useCases/DeleteItemUseCase'
import UserRepository from '/infrastructure/repositories/UserRepository'
import { SearchItemsUseCase } from '/useCases/SearchItemsUseCase'
import { ImageProcessingService } from '/services/ImageProcessingService'
import { ImageStorageService } from '/services/ImageStorageService'
import { FifthApiService, ImageService } from '@dmtool/infrastructure'
import { GetFifthSRDItemUseCase } from '/useCases/GetFifthSRDItemUseCase'
import _ from 'lodash'
import { Order } from '@dmtool/common'
import { IncreaseItemViewCountUseCase } from '/useCases/IncreaseItemViewCountUseCase'
import ItemViewsRepository from '/infrastructure/repositories/ItemViewsRepository'
import { RemoveItemViewsUseCase } from '/useCases/RemoveItemViewsUseCase'
const authentication = new Authentication(passport)

const imageService = new ImageService()
const imageProcessingService = new ImageProcessingService()
const imageStorageService = new ImageStorageService()
const imageRepository = new ImageRepository()
const saveImageUseCase = new SaveImageUseCase(imageService, imageProcessingService, imageStorageService, imageRepository)
const itemRepository = new ItemRepository()
const itemService = new ItemService(itemRepository)
const userService = new UserService(new UserRepository())

const removeImageFromItemUseCase = new RemoveImageFromItemUseCase(itemRepository, imageStorageService, imageRepository)
const saveItemUseCase = new SaveItemUseCase(itemService, itemRepository, saveImageUseCase)

const itemViewRepository = new ItemViewsRepository()
const removeItemViewsUseCase = new RemoveItemViewsUseCase(itemViewRepository)

const deleteItemUseCase = new DeleteItemUseCase(itemRepository, removeImageFromItemUseCase, removeItemViewsUseCase)
const searchItemsUseCase = new SearchItemsUseCase(itemRepository)
const getFifthSRDItemUseCase = new GetFifthSRDItemUseCase(new FifthApiService(), itemRepository)

const increaseItemViewCountUseCase = new IncreaseItemViewCountUseCase(itemViewRepository)

interface SearchQueryParams extends Omit<ItemSearchRequest, 'order' | 'orderBy'> {
  order?: `${Order}`
  orderBy?: (typeof ItemSortableKeys)[number]
}

@Route('/')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class ItemController extends Controller {
  @Tags('Item')
  @Get('items/')
  public async search(@Request() request: express.Request, @Queries() queryParams: SearchQueryParams): Promise<ItemSearchResponse> {
    if (request?.isAuthenticated()) {
      return await searchItemsUseCase.execute({
        userId: (request.user as User).id,
        ...{
          order: Order.ASCENDING,
          orderBy: 'name',
          ...queryParams
        },
        unknownError: throwUnknownError,
        invalidArgument: throwIllegalArgument
      })
    } else {
      return await searchItemsUseCase.execute({
        ...{
          order: Order.ASCENDING,
          orderBy: 'name',
          ...queryParams
        },
        unknownError: throwUnknownError,
        invalidArgument: throwIllegalArgument
      })
    }
  }

  @Tags('Item')
  @Get('items/{userId}')
  public async getAllForUser(@Request() request: express.Request, @Path() userId?: string): Promise<ItemResponse[]> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }
    return (await itemRepository.getAllForUser((request.user as User).id)).map((item) => {
      return item
    })
  }

  @Tags('Item')
  @Get('item/')
  public async get(@Request() request: express.Request, @Query() id: string, @Query() source: `${Source}`): Promise<ItemResponse> {
    if (id && source === Source.FifthESRD) {
      const item = await getFifthSRDItemUseCase.execute({
        unknownError: throwUnknownError,
        invalidArgument: throwIllegalArgument,
        itemName: id
      })
      if (item) {
        await increaseItemViewCountUseCase.execute({
          itemId: item.id,
          source: item.source,
          unknownError: throwUnknownError,
          invalidArgument: throwIllegalArgument
        })
      }
      return item
    } else if (id && source) {
      const item = await itemRepository.getByIdAndSource(id, source)
      if (item.visibility === Visibility.LOGGED_IN && !request.user) {
        throw new ApiError(404, 'NotFound')
      }
      if (item) {
        await increaseItemViewCountUseCase.execute({
          itemId: item.id,
          source: item.source,
          unknownError: throwUnknownError,
          invalidArgument: throwIllegalArgument
        })
      }
      return item
    } else if (id) {
      const item = await itemRepository.getById(id)
      if (item.visibility === Visibility.LOGGED_IN && !request.user) {
        throw new ApiError(404, 'NotFound')
      }
      if (item) {
        await increaseItemViewCountUseCase.execute({
          itemId: item.id,
          source: item.source,
          unknownError: throwUnknownError,
          invalidArgument: throwIllegalArgument
        })
      }
      return item
    } else {
      return await itemRepository.getById(ITEM_DEFAULTS.DEFAULT_ITEM_ID)
    }
  }

  @Tags('Item')
  @Get('item/{itemId}')
  public async getItem(@Request() request: express.Request, @Path() itemId: string): Promise<ItemResponse> {
    try {
      const item = await itemRepository.getById(itemId)
      if (item.visibility === Visibility.LOGGED_IN && !request.user) {
        throw new ApiError(404, 'NotFound')
      }
      return item
    } catch (err) {
      return await getFifthSRDItemUseCase.execute({
        unknownError: throwUnknownError,
        invalidArgument: throwIllegalArgument,
        itemName: itemId
      })
    }
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

    let item = requestBody.item

    if (!isArmor(item)) {
      item = _.omit<typeof item>(item, 'armorClass') as ItemUpdateRequest['item']
      item = _.omit<typeof item>(item, 'strengthMinimum') as ItemUpdateRequest['item']
      item = _.omit<typeof item>(item, 'stealthDisadvantage') as ItemUpdateRequest['item']
    }

    if (!isWeapon(item)) {
      item = _.omit<typeof item>(item, 'damage') as ItemUpdateRequest['item']
      item = _.omit<typeof item>(item, 'twoHandedDamage') as ItemUpdateRequest['item']
      item = _.omit<typeof item>(item, 'useRange') as ItemUpdateRequest['item']
    }

    if (!isArmor(item) && !isWeapon(item)) {
      item = _.omit<typeof item>(item, 'properties') as ItemUpdateRequest['item']
    }

    const savedItemResponse = await saveItemUseCase.execute({
      userId: (request.user as User).id,
      item,
      image: requestBody.image,
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })

    return {
      ...savedItemResponse,
      item: {
        ...savedItemResponse.item,
        createdByUserName: await userService.getUserNameByUserId(savedItemResponse.item.createdBy)
      }
    }
  }

  @Tags('Item')
  @SuccessResponse('200', 'OK')
  @Delete('item/{itemId}')
  public async deleteIem(@Request() request: express.Request, @Path() itemId: string): Promise<ItemResponse> {
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
