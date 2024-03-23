export interface IJwtPayload {
  userId: string
  iss: string
  iat: number
  sub: string
  exp: number
}
