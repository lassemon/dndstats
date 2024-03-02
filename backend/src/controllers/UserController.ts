import UserMapper from 'mappers/UserMapper'
import { Body, Controller, Delete, Get, Middlewares, Post, Put, Request, Response, Route, SuccessResponse, Tags } from 'tsoa'
import { Logger } from '@dmtool/common'
import UserRepository from '/infrastructure/repositories/UserRepository'
import Authentication from '/security/Authentication'
import passport from 'passport'
import { AuthenticatedRequest } from '/infrastructure/entities/AuthenticatedRequest'
import { UpdateUserUseCase } from '/useCases/UpdateUserUseCase'
import { throwIllegalArgument, throwUnknownError } from '/utils/errorUtil'
import { UserInsertRequest, UserResponse, UserService, UserUpdateRequest } from '@dmtool/application'
import { ApiError } from '@dmtool/domain'

const log = new Logger('UserController')
const authentication = new Authentication(passport)

const userMapper = new UserMapper()
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userMapper, userRepository, userService)

@Route('/user')
export class UserController extends Controller {
  constructor() {
    super()
  }

  @Tags('user')
  @Get()
  @Middlewares(authentication.authenticationMiddleware())
  public async getAll(@Request() request: AuthenticatedRequest): Promise<UserResponse[]> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    log.debug('getting all users')
    return userMapper.mapAllToResponse(await userRepository.getAll())
  }

  @Tags('user')
  @Get('{id}')
  @Middlewares(authentication.authenticationMiddleware())
  @Response(404, 'Not Found')
  @SuccessResponse(200, 'Ok')
  public async get(@Request() request: AuthenticatedRequest, id: string): Promise<UserResponse> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    log.debug('getting user with id: ' + id)
    const user = await userRepository.getById(id)
    if (!user.active) {
      throw new ApiError(404, 'NotFound')
    }
    return userMapper.mapToResponse(user)
  }

  @Tags('user')
  @Post()
  @Middlewares(authentication.authenticationMiddleware())
  @Response(401, 'Unauthorized')
  @Response(409, 'Conflict')
  @Response(400, 'Bad Request')
  @SuccessResponse(200, 'Ok')
  public async insert(@Request() request: AuthenticatedRequest, @Body() requestBody: UserInsertRequest): Promise<UserResponse> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }

    log.debug('inserting user: ' + JSON.stringify(request))
    const userInsert = await userMapper.mapInsertToQuery(requestBody)
    const user = await userRepository.create(userInsert)
    if (!user.active) {
      throw new ApiError(404, 'NotFound')
    }
    return userMapper.mapToResponse(user)
  }

  @Tags('user')
  @Put()
  @Middlewares(authentication.authenticationMiddleware())
  @Response(401, 'Unauthorized')
  @Response(404, 'Not Found')
  @SuccessResponse(200, 'Ok')
  public async put(@Request() request: AuthenticatedRequest, @Body() requestBody: UserUpdateRequest): Promise<UserResponse> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    const dbUser = await userRepository.getById(request.user.id)
    if (!dbUser.active) {
      throw new ApiError(404, 'NotFound')
    }

    if (JSON.stringify(dbUser) !== JSON.stringify(request.user)) {
      throw new ApiError(401, 'Unauthorized', 'Cannot update somebody elses account.')
    }

    return await updateUserUseCase.execute({
      userUpdateRequest: requestBody,
      loggedInUser: request.user,
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })
  }

  @Tags('user')
  @Delete('{id}')
  @Middlewares(authentication.authenticationMiddleware())
  @Response(401, 'Unauthorized')
  @Response(404, 'Not Found')
  @SuccessResponse(200, 'Ok')
  public async delete(@Request() request: AuthenticatedRequest, id: string): Promise<void> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    log.debug('deactivating user with id: ' + id)
    await userRepository.deactivate(id)
  }
}
