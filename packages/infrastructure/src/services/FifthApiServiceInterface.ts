import { ItemCategory } from '@dmtool/domain'

export interface FifthApiServiceInterface {
  get: <T>(path: string, nameQuery?: string) => Promise<T>
  parseCategoryName: (categoryName: string) => ItemCategory
  parseCategoryNames: (categoryNames: string[]) => ItemCategory[]
}
