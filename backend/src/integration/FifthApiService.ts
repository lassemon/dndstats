import { get } from 'utils/fetch'

const fifthApiUrl = 'https://www.dnd5eapi.co/api'

export interface Item {}

export class FifthApiService {
  public async get(path: string, nameQuery?: string): Promise<any> {
    console.log('gettin url', `${fifthApiUrl}${path}${nameQuery ? `/?name=${nameQuery}` : ''}`)
    const items = await get(`${fifthApiUrl}${path}${nameQuery ? `/?name=${nameQuery}` : ''}`)
    return items
  }
}
