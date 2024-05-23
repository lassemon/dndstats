import { ItemResponse } from './Item'

export interface PageStatsResponse {
  featuredItem: ItemResponse
  trendingItems: ItemResponse[]
}
