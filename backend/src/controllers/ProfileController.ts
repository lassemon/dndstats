import { Controller, Get, Middlewares, Request, Route, Tags } from 'tsoa'
import Authentication from '/security/Authentication'
import passport from 'passport'
import { AuthenticatedRequest } from '/infrastructure/entities/AuthenticatedRequest'
import ApiError from '/domain/errors/ApiError'
import { User } from '@dmtool/domain'
import ItemRepository from '/infrastructure/repositories/ItemRepository'
import { ProfileResponse } from '@dmtool/application'

const authentication = new Authentication(passport)
const itemRepository = new ItemRepository()

@Route('/profile')
export class ProfileController extends Controller {
  constructor() {
    super()
  }

  @Tags('profile')
  @Get()
  @Middlewares(authentication.authenticationMiddleware())
  public async getAll(@Request() request: AuthenticatedRequest): Promise<ProfileResponse> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    const itemsCreated = await itemRepository.countItemsCreatedByUser((request.user as User).id)

    return {
      itemsCreated,
      spellsCreated: 0,
      weaponsCreated: 0,
      monstersCreated: 0
    }
  }
}
