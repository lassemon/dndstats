import { User } from '@dmtool/domain'
import { IJwtPayload } from 'interfaces/user'
import jwt from 'jsonwebtoken'
import { DateTime, Duration } from 'luxon'
import { Logger } from '@dmtool/common'

const logger = new Logger('Authorization')

export default class Authorization {
  private identifier: string

  constructor() {
    this.identifier = process.env.IDENTIFIER || 'localhost'
  }

  public createAuthToken = (user: User): string => {
    const jwtTokenLife = parseInt(process.env.TOKEN_EXP || '15', 10)
    const jwtSecret = process.env.JWT_SECRET || 'jwtSecret'
    const expires = DateTime.now()
      .plus(Duration.fromObject({ minutes: jwtTokenLife }))
      .toUnixInteger()
    const authToken = jwt.sign(
      {
        exp: expires,
        userId: user.id
      },
      jwtSecret,
      {
        issuer: this.identifier,
        subject: this.identifier + '|' + user.id
      }
    )

    logger.debug('CREATED AUTH TOKEN THAT IS ISSUED AT ' + DateTime.fromSeconds(this.decodeToken(authToken).iat).toFormat('dd HH:mm:ss'))
    logger.debug('CREATED AUTH TOKEN THAT EXPIRES IN ' + DateTime.fromSeconds(this.decodeToken(authToken).exp).toFormat('dd HH:mm:ss'))

    return authToken
  }

  public createRefreshToken = (user: User): string => {
    const refreshTokenLife = parseInt(process.env.REFRESH_TOKEN_EXP || '720', 10)
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refreshSecret'
    const expires = DateTime.now()
      .plus(Duration.fromObject({ minutes: refreshTokenLife }))
      .toUnixInteger()
    const refreshToken = jwt.sign(
      {
        exp: expires,
        userId: user.id
      },
      refreshTokenSecret,
      {
        issuer: this.identifier,
        subject: this.identifier + '|' + user.id
      }
    )

    logger.debug(
      'CREATED REFRESH TOKEN THAT IS ISSUED AT ' + DateTime.fromSeconds(this.decodeToken(refreshToken).iat).toFormat('dd HH:mm:ss')
    )
    logger.debug(
      'CREATED REFRESH TOKEN THAT EXPIRES IN ' + DateTime.fromSeconds(this.decodeToken(refreshToken).exp).toFormat('dd HH:mm:ss')
    )

    return refreshToken
  }

  public decodeToken = (token: string): IJwtPayload => {
    return jwt.decode(token) as IJwtPayload
  }

  public validateToken = (token: IJwtPayload): boolean => {
    let isValid = false
    const expires = DateTime.fromSeconds(token.exp)
    isValid = expires > DateTime.now()
    return isValid
  }
}
