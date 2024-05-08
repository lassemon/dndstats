import { Controller, Get, Middlewares, Path, Request, Route, Tags } from 'tsoa'
import express from 'express'
import passport from 'passport'
import Authentication from '/security/Authentication'
import { GetAllMonstersUseCase } from '/useCases/GetAllMonstersUserCase'
import { GetMonsterUseCase } from '/useCases/GetMonsterUseCase'
import { throwIllegalArgument, throwUnknownError } from '/utils/errorUtil'
import { FifthApiService } from '@dmtool/infrastructure'
const authentication = new Authentication(passport)

const fifthApiService = new FifthApiService()
const getAllMonstersUseCase = new GetAllMonstersUseCase(fifthApiService)
const getMonsterUseCase = new GetMonsterUseCase(fifthApiService)

@Route('/')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class MonsterController extends Controller {
  @Tags('Monster')
  @Get('monsters/')
  public async search(@Request() request: express.Request): Promise<any> {
    return await getAllMonstersUseCase.execute({
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })
  }

  @Tags('Monster')
  @Get('monsters/{monsterName}')
  public async get(@Request() request: express.Request, @Path() monsterName: string): Promise<any> {
    return await getMonsterUseCase.execute({
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument,
      monsterName
    })
  }
}
