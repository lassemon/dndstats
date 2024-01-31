import { ItemService } from 'services/ItemService'
import { Controller, Get, Middlewares, Path, Request, Route, Tags } from 'tsoa'
import { constructUrl } from 'utils/url'
import express from 'express'
import passport from 'passport'
import Authentication from '/security/Authentication'
const authentication = new Authentication(passport)

@Route('/')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class MonsterController extends Controller {
  @Tags('Api')
  @Get('monsters/')
  public async search(@Request() request: express.Request): Promise<any> {
    console.log('calling monster list isAuthenticated', request?.isAuthenticated())
    const path = constructUrl(['monsters'])
    return new ItemService().get(path)
  }

  @Tags('Api')
  @Get('monsters/{monsterName}')
  public async get(@Request() request: express.Request, @Path() monsterName?: string): Promise<any> {
    console.log('calling monster isAuthenticated', request?.isAuthenticated())
    const path = constructUrl(['monsters', monsterName])
    return new ItemService().get(path)
  }
}
