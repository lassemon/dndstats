import { ApiError } from '@dmtool/domain'
import { DatabaseUserRepositoryInterface } from '../repositories/UserRepositoryInterface'
import { UserServiceInterface } from './UserServiceInterface'
import { Encryption } from '../security/Encryption'

export class UserService implements UserServiceInterface {
  constructor(private readonly userRepository: DatabaseUserRepositoryInterface) {}

  async validatePasswordChange(userId: string, newPassword: string, oldPassword?: string) {
    if (!oldPassword) {
      throw new ApiError(401, 'Unauthorized')
    }
    const dbUser = await this.userRepository.getById(userId)
    if (!(await Encryption.compare(oldPassword, dbUser.password))) {
      throw new ApiError(401, 'Unauthorized')
    }

    return this.validateNewPassword(newPassword)
  }

  validateNewPassword(newPassword: string) {
    // TODO new password length and complexity rules?
    // duplicate these rules to frontend input validation when implementing
    return true
  }

  async getUserNameByUserId(userId: string) {
    const user = await this.userRepository.getById(userId)
    return user.name
  }
}
