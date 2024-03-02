import { FetchOptions, PageStatsResponse } from '@dmtool/application'
import { getJson } from 'infrastructure/dataAccess/http/fetch'

export interface PageStatsServiceInterface {
  getPageStats: (options: FetchOptions) => Promise<PageStatsResponse>
}

export class PageStatsService implements PageStatsServiceInterface {
  constructor() {}

  async getPageStats(options: FetchOptions = {}) {
    return await getJson<PageStatsResponse>({ ...{ endpoint: `/pagestats` }, ...options })
  }
}
