import { Source } from '@dmtool/domain'

export const emptyItem = { id: '', name: '', url: '', source: Source.HomeBrew }

export interface ItemListOption {
  id: string
  name: string
  url?: string
  source: `${Source}`
}
