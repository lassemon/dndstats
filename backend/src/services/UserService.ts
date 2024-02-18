import connection from 'infrastructure/database/connection'
import ApiError from '/domain/errors/ApiError'
import { isEmpty } from 'lodash'
import UserMapper from 'mappers/UserMapper'
import UserModel from 'models/UserModel'
import { Logger } from '@dmtool/common'
import { User, UserUpdateRequest } from '@dmtool/domain'
import { UserInsertRequest } from '@dmtool/domain/src/entities/User'

const log = new Logger('UserService')

export default class UserService {
  private userModel: UserModel
  private userMapper: UserMapper

  constructor() {
    this.userModel = new UserModel({
      tableName: 'users',
      connection
    })
    this.userMapper = new UserMapper()
  }

  public async getAll(): Promise<User[]> {
    try {
      const users = await this.userModel.getAll()
      return this.userMapper.serializeAll(users)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.error(error)
      throw new ApiError(404, 'UserNotFound', 'Users not found')
    }
  }

  public async find(filter: any): Promise<User[]> {
    try {
      const users = (await this.userModel.find(filter)) as User[]
      if (isEmpty(users)) {
        throw new ApiError(404, 'UserNotFound', 'Users not found')
      }
      return this.userMapper.serializeAll(users)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.error(error)
      throw new ApiError(404, 'UserNotFound', 'Users not found')
    }
  }

  public async findById(id: number): Promise<User> {
    try {
      const user = await this.userModel.findById(id)
      if (isEmpty(user)) {
        throw new ApiError(404, 'UserNotFound', 'User not found with id: ' + id)
      }
      return this.userMapper.serialize(user)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.error(error)
      throw new ApiError(404, 'UserNotFound', 'User not found with id: ' + id)
    }
  }

  public async findByName(username: string): Promise<User> {
    try {
      const user = await this.userModel.findByName(username)
      if (isEmpty(user)) {
        throw new ApiError(404, 'UserNotFound', 'Users not found with name: ' + username)
      }
      return this.userMapper.serialize(user)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.error(error)
      throw new ApiError(404, 'UserNotFound', 'User not found with name: ' + username)
    }
  }

  public count(): Promise<number> {
    try {
      return this.userModel.count() as Promise<number>
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.error(error)
      throw new ApiError(400, 'BadRequest', 'User count failed')
    }
  }

  public async insert(insertRequest: UserInsertRequest): Promise<User> {
    try {
      const userInsert = await this.userMapper.mapInsertToQuery(insertRequest)
      const user = await this.userModel.insert(userInsert)
      return this.userMapper.serialize(user)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.error(error)
      throw new ApiError(400, 'BadRequest', 'User insert failed')
    }
  }

  public async update(updateRequest: UserUpdateRequest, loggedInUser: User): Promise<User> {
    try {
      const userUpdate = await this.userMapper.mapUpdateToQuery(updateRequest, loggedInUser)
      const user = (await this.userModel.update(userUpdate)) as User
      return this.userMapper.serialize(user)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.error(error)
      throw new ApiError(400, 'BadRequest', 'User update failed')
    }
  }

  public remove(id: number): Promise<boolean> {
    try {
      return this.userModel.remove(id)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.error(error)
      throw new ApiError(400, 'BadRequest', 'User remove failed')
    }
  }

  public setModel(model: UserModel) {
    this.userModel = model
  }
}
