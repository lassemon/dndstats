import { UserServiceInterface } from './UserServiceInterface'
import ApiError from '/domain/errors/ApiError'
import Encryption from 'security/Encryption'
import { DatabaseUserRepositoryInterface } from '@dmtool/application'

export class UserService implements UserServiceInterface {
  constructor(private readonly userRepository: DatabaseUserRepositoryInterface) {}

  async validatePasswordChange(userId: string, newPassword: string, oldPassword?: string) {
    if (!oldPassword) {
      throw new ApiError(401, 'Unauthorized')
    }
    const dbUser = await this.userRepository.getById(userId)
    console.log('comparing')
    console.log('oldPassword', oldPassword)
    console.log('dbUser.password', dbUser.password)
    if (!(await Encryption.compare(oldPassword, dbUser.password))) {
      console.log('OLD PASSWORD WAS NOT THE SAME AS IN DB')
      throw new ApiError(401, 'Unauthorized')
    }

    return this.validateNewPassword(newPassword)
  }

  validateNewPassword(newPassword: string) {
    // TODO new password length and complexity rules?
    // duplicate these rules to frontend input validation when implementing
    return true
  }
}
