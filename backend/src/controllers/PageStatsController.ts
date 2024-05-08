import { PageStatsResponse } from '@dmtool/application'
import { Controller, Get, Middlewares, Request, Route, Tags } from 'tsoa'
import ItemRepository from '/infrastructure/repositories/ItemRepository'
import express from 'express'
import { User } from '@dmtool/domain'
import Authentication from '/security/Authentication'
import passport from 'passport'
const authentication = new Authentication(passport)

const itemRepository = new ItemRepository()

@Route('/pagestats')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class PageStatsController extends Controller {
  constructor() {
    super()
  }

  @Tags('page')
  @Get()
  public async get(@Request() request: express.Request): Promise<PageStatsResponse> {
    const itemsCreated = await itemRepository.countAll(request?.isAuthenticated() ? (request.user as User).id : undefined)
    return {
      itemsCreated,
      spellsCreated: 0,
      weaponsCreated: 0,
      monstersCreated: 0
    }
  }
}
