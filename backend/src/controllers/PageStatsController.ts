import { PageStatsResponse } from '@dmtool/application'
import { Controller, Get, Route, Tags } from 'tsoa'
import ItemRepository from '/infrastructure/repositories/ItemRepository'

const itemRepository = new ItemRepository()

@Route('/pagestats')
export class PageStatsController extends Controller {
  constructor() {
    super()
  }

  @Tags('page')
  @Get()
  public async get(): Promise<PageStatsResponse> {
    const itemsCreated = await itemRepository.countAll()

    return {
      itemsCreated,
      spellsCreated: 0,
      weaponsCreated: 0,
      monstersCreated: 0
    }
  }
}
