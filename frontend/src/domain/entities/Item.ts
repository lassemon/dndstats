import { Source } from '@dmtool/domain'

export const emptyItem = { id: '', name: '', url: '', source: Source.HomeBrew }
export const loggedInEmptyItem = { id: '', name: '', url: '', source: Source.MyItem }

export interface ItemListOption {
  id: string
  name: string
  url?: string
  source: `${Source}`
}
