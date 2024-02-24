export interface IJwtPayload {
  user: string
  iss: string
  iat: number
  sub: string
  exp: number
}
