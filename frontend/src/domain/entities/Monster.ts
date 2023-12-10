import { Source } from 'interfaces'

export const emptyMonster = { id: '', name: '', url: '', source: Source.HomeBrew }

export interface MonsterListOption {
  id: string
  name: string
  url?: string
  source: `${Source}`
}
