import { Body, Controller, Middlewares, Post, Request, Route, SuccessResponse, Tags } from 'tsoa'
import passport from 'passport'
import Authentication from '/security/Authentication'
import express from 'express'
import ApiError from '/domain/errors/ApiError'
const authentication = new Authentication(passport)

@Route('/')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class ItemController extends Controller {
  @Tags('Api')
  @SuccessResponse('201', 'Created')
  @Post('item/')
  public async create(@Request() request: express.Request, @Body() requestBody: any): Promise<any> {
    console.log('creating item request', request)
    console.log('creating item isAuthenticated', request?.isAuthenticated())
    if (!request?.isAuthenticated()) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }
    console.log('creating item body', requestBody)

    //return new ItemService().get(path)
    return { ...requestBody, wasAtBackEnd: true }
  }
}
