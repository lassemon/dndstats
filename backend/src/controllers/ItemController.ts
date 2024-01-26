import { ItemService } from 'services/ItemService'
import { Controller, Get, Middlewares, Path, Query, Request, Route, Tags } from 'tsoa'
import { constructUrl } from 'utils/url'
import express from 'express'
import passport from 'passport'
import Authentication from '/security/Authentication'
const authentication = new Authentication(passport)
@Route('/')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class ItemController extends Controller {
  @Tags('Api')
  @Get('{category}/{itemType}')
  public async get(@Request() request: express.Request, @Path() category: string, @Path() itemType?: string): Promise<any> {
    console.log('calling monster list isAuthenticated', request?.isAuthenticated())
    const path = constructUrl([category, itemType])
    return new ItemService().get(path)
  }

  @Tags('Api')
  @Get('{category}/')
  public async search(@Request() request: express.Request, @Path() category: string, @Query() name?: string): Promise<any> {
    console.log('calling monster list isAuthenticated', request?.isAuthenticated())
    const path = constructUrl([category])
    return new ItemService().get(path, name)
  }
}
