import { ApiError, UnknownError, User } from '@dmtool/domain'
import connection from '../database/connection'
import { Logger } from '@dmtool/common'
import { DateTime } from 'luxon'
import { DatabaseUserRepositoryInterface, UserInsertQuery, UserUpdateQuery } from '@dmtool/application'

const logger = new Logger('UserRepository')

interface DBUser extends Omit<User, 'roles'> {
  roles: string
}

class UserRepository implements DatabaseUserRepositoryInterface {
  async getAll(): Promise<User[]> {
    throw new ApiError(501, 'NotImplemented')
  }

  async getById(userId: string): Promise<User> {
    const user = await connection.select('*').from<any, DBUser>('users').where('id', userId).first()
    if (!user) {
      throw new ApiError(404, 'NotFound', `User with id "${userId}" was not found.`)
    }
    return {
      ...user,
      roles: JSON.parse(user.roles)
    }
  }

  async getByName(username: string): Promise<User> {
    const user = await connection.select('*').from<any, DBUser>('users').where('name', username).first()
    if (!user) {
      throw new ApiError(404, 'NotFound', `User by name "${username}" was not found.`)
    }
    return {
      ...user,
      roles: JSON.parse(user.roles)
    }
  }

  async count(): Promise<number> {
    throw new ApiError(501, 'NotImplemented')
  }

  async create(user: UserInsertQuery): Promise<User> {
    const updatedAt = DateTime.now().toUnixInteger()
    const userToInsert: DBUser = {
      ...user,
      roles: JSON.stringify(user.roles || []),
      createdAt: updatedAt,
      updatedAt: updatedAt
    }
    try {
      await connection<any, User>('users').insert(userToInsert) // mariadb does not return inserted object
    } catch (error) {
      logger.error((error as any)?.message)
      throw new UnknownError(500, 'UnknownError')
    }

    return {
      ...userToInsert,
      roles: JSON.parse(userToInsert.roles)
    }
  }

  async update(user: UserUpdateQuery): Promise<User> {
    const updatedAt = DateTime.now().toUnixInteger()
    const userToInsert = {
      ...user,
      updatedAt: updatedAt
    }
    try {
      await connection<any, User>('users').where('id', userToInsert.id).update(userToInsert) // mariadb does not return inserted object
    } catch (error) {
      logger.error((error as any)?.message)
      throw new UnknownError(500, 'UnknownError')
    }

    return await this.getById(user.id)
  }

  async deactivate(userId: string): Promise<void> {}
}

export default UserRepository
