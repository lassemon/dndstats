import express from 'express'
import { Body, Controller, Get, Middlewares, Post, Request, Response, Route, Tags } from 'tsoa'
import { ILoginRequest } from '../interfaces/requests'
import Authorization from '/security/Authorization'
import { Logger } from '@dmtool/common'
import { DateTime } from 'luxon'
import UserMapper from '/mappers/UserMapper'
import Authentication from '/security/Authentication'
import passport from 'passport'
import { ApiError, User } from '@dmtool/domain'
import UserRepository from '/infrastructure/repositories/UserRepository'
import { Encryption, UserResponse } from '@dmtool/application'

const logger = new Logger('AuthController')
const refreshTokenList = {} as { [key: string]: User }
const authentication = new Authentication(passport)

const userRepository = new UserRepository()
const userMapper = new UserMapper()
const authorization = new Authorization()

async function loginMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
  const username: string = request.body.username
  const password: string = request.body.password

  try {
    const user = await userRepository.getByName(username)

    if (!(await Encryption.compare(password, user.password)) || !user.active) {
      response.status(404).send({ statusTest: 'Unauthorized', message: 'Incorrect username or password' })
    } else {
      const authToken = authorization.createAuthToken(user)
      const refreshToken = authorization.createRefreshToken(user)

      response.cookie('token', authToken, { httpOnly: true })
      response.cookie('refreshToken', refreshToken, { httpOnly: true })

      refreshTokenList[refreshToken] = user

      response.json(userMapper.mapToResponse(user))
    }
  } catch (error) {
    response.status(404).send({ statusTest: 'Unauthorized', message: 'Incorrect username or password' })
  }
  next()
}

async function logoutMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
  response.clearCookie('token')
  response.clearCookie('refreshToken')
  next()
}

async function refreshMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
  if (request && request.cookies && request.cookies.refreshToken in refreshTokenList) {
    const refreshToken = authorization.decodeToken(request.cookies.refreshToken)

    if (!authorization.validateToken(refreshToken)) {
      logger.debug('REFRESH TOKEN EXPIRED ' + DateTime.fromSeconds(refreshToken.exp).toFormat('dd HH:mm:ss'))
      response.status(404).send({ statusTest: 'Unauthorized' })
    } else {
      const user = await userRepository.getById(refreshToken.userId)
      if (!user.active) {
        throw new ApiError(404, 'NotFound')
      }
      const newAuthToken = authorization.createAuthToken(user)

      response.cookie('token', newAuthToken, { httpOnly: true })
    }
  } else {
    logger.debug('REFRESH TOKEN NOT IN LIST')
    response.status(404).send({ statusTest: 'Unauthorized' })
  }
  next()
}

@Route('/auth')
export class AuthController extends Controller {
  private userMapper: UserMapper

  constructor() {
    super()
    this.userMapper = new UserMapper()
  }

  @Tags('Auth')
  @Response<UserResponse>(200, 'Success')
  @Post('login')
  @Middlewares(loginMiddleware)
  public async login(@Body() loginParams: ILoginRequest): Promise<boolean> {
    return true
  }

  @Tags('Auth')
  @Response(401, 'Unauthorized')
  @Response(200, 'Success')
  @Post('logout')
  @Middlewares(logoutMiddleware)
  public async logout(): Promise<boolean> {
    return true
  }

  @Tags('Auth')
  @Response(401, 'Unauthorized')
  @Response(200, 'Success')
  @Post('refresh')
  @Middlewares(refreshMiddleware)
  public async refresh(): Promise<boolean> {
    return true
  }

  @Tags('Auth')
  @Middlewares(authentication.authenticationMiddleware())
  @Get('status')
  public async status(@Request() request: express.Request): Promise<UserResponse> {
    logger.debug(`calling status to see if authenticated. isAuthenticated: ${request?.isAuthenticated()}.`)
    return this.userMapper.mapToResponse(request.user as User)
  }
}
