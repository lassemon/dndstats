/**
 * @tsoaModel
 */
export interface IUser {
  id: number
  name: string
  password: string
  email: string
  created: Date
}

/**
 * @tsoaModel
 */
export interface IDBUser {
  id: number
  name: string
  password: string
  email: string
  created: Date
}

export interface IJwtPayload {
  user: number
  iss: string
  iat: number
  sub: string
  exp: number
}

/**
 * @tsoaModel
 */
export interface IUserResponse {
  id: number
  name: string
  email: string
  created: Date
}
