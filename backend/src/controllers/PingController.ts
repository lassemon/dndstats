import { Controller, Get, Middlewares, Request, Route, Security } from 'tsoa'
import Authentication from '/security/Authentication'
import express from 'express'
import passport from 'passport'
const authentication = new Authentication(passport)

@Route('/')
export class PingController extends Controller {
  @Get()
  public async ping(): Promise<any> {
    return 'Hello World!'
  }
}

@Route('/ping')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class PingController1 extends Controller {
  @Get()
  public async ping(@Request() request: express.Request): Promise<any> {
    console.log('isAuthenticated', request?.isAuthenticated())
    return {
      ping: 'pong'
    }
  }
}

@Route('/secureping')
@Middlewares(authentication.authenticationMiddleware())
export class PingController2 extends Controller {
  @Get('')
  public async ping(): Promise<any> {
    return {
      securePing: 'pong'
    }
  }
}

@Route('/apikeyping')
export class PingController3 extends Controller {
  @Security('api_key')
  @Get('')
  public async ping(): Promise<any> {
    return {
      apiKeyPing: 'pong'
    }
  }
}
