import { DatabaseUserRepositoryInterface, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { User, UserResponse, UserUpdateRequest } from '@dmtool/domain'
import ApiError from '/domain/errors/ApiError'
import UserMapper from '/mappers/UserMapper'
import { UserServiceInterface } from '/controllers/application/services/UserServiceInterface'

export interface UpdateUserUseCaseOptions extends UseCaseOptionsInterface {
  userUpdateRequest: UserUpdateRequest
  loggedInUser: User
}

export type UpdateUserUseCaseInterface = UseCaseInterface<UpdateUserUseCaseOptions, UserResponse>

export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly userRepository: DatabaseUserRepositoryInterface,
    private readonly userService: UserServiceInterface
  ) {}

  async execute({ userUpdateRequest, loggedInUser }: UpdateUserUseCaseOptions): Promise<UserResponse> {
    if (userUpdateRequest.newPassword) {
      await this.userService.validatePasswordChange(loggedInUser.id, userUpdateRequest.newPassword, userUpdateRequest.oldPassword)
    }
    const userUpdateQuery = await this.userMapper.mapUpdateToQuery(userUpdateRequest, loggedInUser)

    console.log('userUpdateQuery', userUpdateQuery)
    const user = await this.userRepository.update(userUpdateQuery)
    if (!user.active) {
      throw new ApiError(404, 'NotFound')
    }
    return this.userMapper.mapToResponse(user)
  }
}
