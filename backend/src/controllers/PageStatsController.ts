import { PageStatsResponse } from '@dmtool/application'
import { Controller, Get, Middlewares, Request, Route, Tags } from 'tsoa'
import ItemRepository from '/infrastructure/repositories/ItemRepository'
import express from 'express'
import Authentication from '/security/Authentication'
import passport from 'passport'
import { GetFeaturedItemUseCase } from '/useCases/GetFeaturedItemUseCase'
import FeaturedRepository from '/infrastructure/repositories/FeaturedRepository'
import { throwIllegalArgument, throwUnknownError } from '/utils/errorUtil'
import { GetTrendingItemsUseCase } from '/useCases/GetTrendingItemsUseCase'
import ItemViewsRepository from '/infrastructure/repositories/ItemViewsRepository'
import { GetLatestItemsUseCase } from '../useCases/GetLatestItemsUseCase'
const authentication = new Authentication(passport)

const featuredRepository = new FeaturedRepository()
const itemRepository = new ItemRepository()
const itemViewsRepository = new ItemViewsRepository()

const getFeaturedItemUseCase = new GetFeaturedItemUseCase(featuredRepository, itemRepository)
const getTrendingItemsUseCase = new GetTrendingItemsUseCase(itemViewsRepository, itemRepository)
const getLatestItemsUseCase = new GetLatestItemsUseCase(itemRepository)

@Route('/pagestats')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class PageStatsController extends Controller {
  constructor() {
    super()
  }

  @Tags('page')
  @Get()
  public async get(@Request() request: express.Request): Promise<PageStatsResponse> {
    const featuredItem = await getFeaturedItemUseCase.execute({
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })
    const trendingItems = await getTrendingItemsUseCase.execute({
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })
    const latestItems = await getLatestItemsUseCase.execute({
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })
    return {
      featuredItem: featuredItem,
      trendingItems: trendingItems,
      latestItems: latestItems
    }
  }
}
