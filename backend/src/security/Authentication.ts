import { IJwtPayload } from 'interfaces/user'
import { isEmpty } from 'lodash'
import { PassportStatic } from 'passport'
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback, StrategyOptions } from 'passport-jwt'
import express from 'express'
import { ApiError, User } from '@dmtool/domain'
import { DatabaseUserRepositoryInterface } from '@dmtool/application'
import UserRepository from '/infrastructure/repositories/UserRepository'

export default class Authentication {
  private passport: PassportStatic
  private static instance: Authentication
  private userRepository: DatabaseUserRepositoryInterface

  constructor(passport: PassportStatic) {
    this.passport = passport
    this.userRepository = new UserRepository()
    this.init()
  }

  private init = () => {
    if (!Authentication.instance) {
      const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (request: express.Request) => {
            let token = null
            if (request && request.cookies) {
              token = request.cookies.token
            }
            return token
          }
        ]),
        secretOrKey: process.env.JWT_SECRET || 'jwtSecret'
      }

      this.passport.use(
        new JwtStrategy(options, async (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
          try {
            const result = await this.userRepository.getById(jwtPayload.userId)

            if (isEmpty(result)) {
              return done(result, false)
            }

            if (!result) {
              return done(null, false)
            } else {
              return done(null, result, { issuedAt: jwtPayload.iat })
            }
          } catch (error) {
            return done(error, false)
          }
        })
      )

      Authentication.instance = this
    }
  }

  public authenticationMiddleware = (...args: any[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const passportAuthenticator = this.passport.authenticate(
        'jwt',
        { session: false },
        (err: any, user: User | false | null, info: object | string | Array<string | undefined>) => {
          if (err) {
            return res.status(500).json(err)
          }
          if (!user) {
            // Authentication failed
            throw new ApiError(401, 'Unauthorized')
          }
          if (user) {
            console.log('====user', user)
            console.log('====user2', JSON.stringify(user))
            req.user = user
          }
          // Proceed to the next middleware, user might be undefined if not authenticated
          return next()
        }
      )
      passportAuthenticator(req, res, next)
    }
  }

  public passThroughAuthenticationMiddleware = () => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const passportAuthenticator = this.passport.authenticate(
        'jwt',
        { session: false },
        (err: any, user: User | false | null, info: object | string | Array<string | undefined>) => {
          if (err) {
            return next(err)
          }
          if (user) {
            req.user = user
          }
          // Proceed to the next middleware, user might be undefined if not authenticated
          return next()
        }
      )
      passportAuthenticator(req, res, next)
    }
  }

  public initialize() {
    return this.passport.initialize()
  }
}
