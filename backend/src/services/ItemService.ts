import { FifthApiService } from "integration/FifthApiService"

export interface Item {}

export class ItemService {
  fifthApiService = new FifthApiService()
  public async get(path: string, itemQuery?: string): Promise<any> {
    ///const items = await get(
    //  `https://www.dnd5eapi.co/api/magic-items/?name=${itemQuery}`
    //)
    const items = await this.fifthApiService.get(path, itemQuery)
    console.log("items", items)
    return items
  }
}
