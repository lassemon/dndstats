import { Source } from '@dmtool/domain'
import { ItemViews } from '../interfaces/http/Item'

export interface DatabaseItemViewsRepositoryInterface {
  getMostTrendingItems(limit: number, loggedIn: boolean): Promise<ItemViews[]>
  incrementViewCount(itemId: string, source: `${Source}`): Promise<void>
  removeItemViews(itemId: string, source: `${Source}`): Promise<void>
}
