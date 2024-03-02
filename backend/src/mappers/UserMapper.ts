import { ApiError, User, UserRole } from '@dmtool/domain'
import { uuid } from '@dmtool/common'
import { Encryption, UserInsertQuery, UserInsertRequest, UserResponse, UserUpdateQuery, UserUpdateRequest } from '@dmtool/application'

export default class UserMapper {
  public mapToResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  public mapAllToResponse(users: User[]): UserResponse[] {
    return users.map(this.mapToResponse, this)
  }

  public async mapInsertToQuery(insertRequest: UserInsertRequest): Promise<UserInsertQuery> {
    const encryptedPassword = await Encryption.encrypt(insertRequest.password)

    const userInsert = {
      ...insertRequest,
      id: uuid(),
      password: encryptedPassword,
      active: true,
      roles: [UserRole.Viewer, UserRole.Creator], // TODO, get roles from frontend, insert defaults here?
      created: new Date()
    }

    if (insertRequest.password === userInsert.password) {
      throw new ApiError(400, 'BadRequest', 'Attempted to add unencrypted password to database')
    }

    return userInsert
  }

  public async mapUpdateToQuery(updateRequest: UserUpdateRequest, loggedInUser: User): Promise<UserUpdateQuery> {
    const userInsert = {
      ...updateRequest,
      ...(updateRequest.newPassword ? { password: await Encryption.encrypt(updateRequest.newPassword) } : {})
    }

    if (typeof userInsert.password !== 'undefined' && userInsert.password !== '' && userInsert.password === updateRequest.newPassword) {
      throw new ApiError(400, 'BadRequest', 'Attempted to add unencrypted password to database')
    }

    return {
      id: loggedInUser.id,
      name: userInsert.name,
      password: userInsert.password,
      email: userInsert.email
    }
  }

  public serialize(user: User): User {
    return {
      id: user.id,
      name: user.name,
      password: user.password,
      email: user.email,
      roles: user.roles,
      active: user.active,
      createdAt: user.createdAt
    }
  }

  public serializeAll(users: User[]): User[] {
    return users.map(this.serialize, this)
  }
}
