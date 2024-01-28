import { Source } from 'interfaces'
import { get } from 'utils/fetch'

export const getMonsterList = async () => {
  const monsterListResult = await get<any>({ endpoint: '/monsters' })
  return monsterListResult.results.map((monster: any) => {
    return {
      ...monster,
      id: monster.index,
      source: Source.FifthESRD
    }
  })
}

export const getMonster = async (monsterUrl: string) => {
  return await get<any>({ endpoint: monsterUrl.replace('/api', '') })
}
