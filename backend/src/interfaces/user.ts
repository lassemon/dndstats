export interface IJwtPayload {
  user: number
  iss: string
  iat: number
  sub: string
  exp: number
}
