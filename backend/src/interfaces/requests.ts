// --- USERS --- //
/**
 * @tsoaModel
 */
export interface ILoginRequest {
  username: string
  password: string
}

/**
 * @tsoaModel
 */
export interface IUserInsertRequest {
  name: string
  email: string
  password: string
}

/**
 * @tsoaModel
 */
export interface IUserInsertQuery {
  name: string
  password: string
  active: boolean
  email: string
  created: Date
}

/**
 * @tsoaModel
 */
export interface IUserUpdateRequest {
  id: number
  name: string
  email: string
  password: string
}

/**
 * @tsoaModel
 */
export interface IUserUpdateQuery {
  id: number
  name: string
  password: string
  email: string
}
