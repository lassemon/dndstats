import { ItemService } from 'services/ItemService'
import { Controller, Get, Path, Query, Route } from 'tsoa'
import { constructUrl } from 'utils/url'

@Route('/api')
export class ItemController extends Controller {
  @Get('{category}/{itemType}')
  public async get(@Path() category: string, @Path() itemType?: string): Promise<any> {
    const path = constructUrl([category, itemType])
    return new ItemService().get(path)
  }

  @Get('{category}/')
  public async search(@Path() category: string, @Query() name?: string): Promise<any> {
    const path = constructUrl([category])
    return new ItemService().get(path, name)
  }
}
