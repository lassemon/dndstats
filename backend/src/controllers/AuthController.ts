import express from 'express'
import ApiError from '/domain/errors/ApiError'
import Encryption from 'security/Encryption'
import { Body, Controller, Get, Middlewares, Post, Request, Response, Route, Tags } from 'tsoa'
import { ILoginRequest } from '../interfaces/requests'
import { IUser, IUserResponse } from '../interfaces/user'
//import UserService from '/services/UserService'
import Authorization from '/security/Authorization'
import Logger from '/utils/Logger'
import { DateTime } from 'luxon'
import UserMapper from '/mappers/UserMapper'
import Authentication from '/security/Authentication'
import passport from 'passport'

const log = new Logger('AuthController')
const refreshTokenList = {} as { [key: string]: IUser }
const authentication = new Authentication(passport)

@Route('/auth')
export class AuthController extends Controller {
  //private userService: UserService
  private userMapper: UserMapper
  private authorization: Authorization
  private cookies

  constructor() {
    super()
    //this.userService = new UserService()
    this.userMapper = new UserMapper()
    this.authorization = new Authorization()
    this.cookies = {}
  }

  @Tags('Auth')
  @Response<IUserResponse>(200, 'Success')
  @Post('login')
  public async login(@Body() loginParams: ILoginRequest): Promise<IUserResponse> {
    //const username: string = loginParams.username
    const password: string = loginParams.password

    const user = { id: 1, name: 'test', email: 'testemail', password: await Encryption.encrypt('test'), created: new Date() } //await this.userService.findByName(username)

    if (!(await Encryption.compare(password, user.password))) {
      throw new ApiError(401, 'Unauthorized', 'Incorrect username or password')
    }

    const authToken = this.authorization.createAuthToken(user)
    const refreshToken = this.authorization.createRefreshToken(user)

    this.setCookies({
      token: {
        value: authToken,
        options: {
          httpOnly: true
        }
      },
      refreshToken: {
        value: refreshToken,
        options: {
          httpOnly: true
        }
      }
    })

    refreshTokenList[refreshToken] = user

    return this.userMapper.mapToResponse(user)
  }

  @Tags('Auth')
  @Response(401, 'Unauthorized')
  @Response(200, 'Success')
  @Post('logout')
  public logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.setCookies({
        token: null,
        refreshToken: null
      })
      resolve(true)
    })
  }

  @Tags('Auth')
  @Response(401, 'Unauthorized')
  @Response(200, 'Success')
  @Post('refresh')
  public async refresh(@Request() request: express.Request): Promise<boolean> {
    if (request && request.cookies && request.cookies.refreshToken in refreshTokenList) {
      const refreshToken = this.authorization.decodeToken(request.cookies.refreshToken)

      if (!this.authorization.validateToken(refreshToken)) {
        log.debug('REFRESH TOKEN EXPIRED ' + DateTime.fromSeconds(refreshToken.exp).toFormat('dd HH:mm:ss'))
        throw new ApiError(401, 'Unauthorized')
      }

      //const user: IUser = await this.userService.findById(refreshToken.user)
      const user = { id: 1, name: 'test', email: 'testemail', password: await Encryption.encrypt('test'), created: new Date() } //await this.userService.findByName(username)
      const newAuthToken = this.authorization.createAuthToken(user)

      this.setCookies({
        token: {
          value: newAuthToken,
          options: {
            httpOnly: true
          }
        }
      })
    } else {
      log.debug('REFRESH TOKEN NOT IN LIST')
      throw new ApiError(401, 'Unauthorized')
    }
    return true
  }

  @Tags('Auth')
  @Middlewares(authentication.authenticationMiddleware())
  @Get('status')
  public async status(@Request() request: express.Request): Promise<IUserResponse> {
    log.debug(`calling status to see if authenticated. isAuthenticated: ${request?.isAuthenticated()}.`)
    return request.user as IUserResponse //await this.userService.findByName(username)
  }

  public requestMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
    const cookies = JSON.parse(JSON.stringify(this.cookies))
    Object.keys(cookies).forEach((name: string) => {
      if (!cookies[name]) {
        response.clearCookie(name)
      } else {
        response.cookie(name, cookies[name].value, cookies[name].options)
      }
    })
    return response
  }

  private setCookies(cookies: any) {
    this.cookies = cookies
  }
}
