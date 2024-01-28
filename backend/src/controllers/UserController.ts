import UserMapper from 'mappers/UserMapper'
import UserService from 'services/UserService'
import { Body, Controller, Delete, Get, Post, Put, Response, Route, Security, SuccessResponse, Tags } from 'tsoa'
import Logger from 'utils/Logger'
import { IUserInsertRequest, IUserUpdateRequest } from '../interfaces/requests'
import { IUserResponse } from '../interfaces/user'

const log = new Logger('UserController')

@Route('/users')
export class UserController extends Controller {
  private userService: UserService
  private userMapper: UserMapper

  constructor() {
    super()
    this.userService = new UserService()
    this.userMapper = new UserMapper()
  }

  @Tags('users')
  @Get()
  public async getAll(): Promise<IUserResponse[]> {
    log.debug('getting all users')
    return this.userMapper.mapAllToResponse(await this.userService.getAll())
  }

  @Tags('users')
  @Get('{id}')
  @Response(404, 'Not Found')
  @SuccessResponse(200, 'Ok')
  public async get(id: number): Promise<IUserResponse> {
    log.debug('getting user with id: ' + id)
    return this.userMapper.mapToResponse(await this.userService.findById(id))
  }

  @Tags('users')
  @Post()
  @Security('jwt')
  @Response(401, 'Unauthorized')
  @Response(409, 'Conflict')
  @Response(400, 'Bad Request')
  @SuccessResponse(200, 'Ok')
  public async insert(@Body() request: IUserInsertRequest): Promise<IUserResponse> {
    log.debug('inserting user: ' + JSON.stringify(request))
    return this.userMapper.mapToResponse(await this.userService.insert(request))
  }

  @Tags('users')
  @Put()
  @Security('jwt')
  @Response(401, 'Unauthorized')
  @Response(404, 'Not Found')
  @SuccessResponse(200, 'Ok')
  public async put(@Body() request: IUserUpdateRequest): Promise<IUserResponse> {
    // TODO validate that logged in user is the same as the one being updated
    log.debug('updating user with id: ' + request.id)
    return this.userMapper.mapToResponse(await this.userService.update(request))
  }

  @Tags('users')
  @Delete('{id}')
  @Security('jwt')
  @Response(401, 'Unauthorized')
  @Response(404, 'Not Found')
  @SuccessResponse(200, 'Ok')
  public async delete(id: number): Promise<boolean> {
    log.debug('deactivating user with id: ' + id)
    return this.userService.remove(id)
  }

  public setService(service: UserService) {
    this.userService = service
  }
}