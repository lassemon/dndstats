import { Source } from '@dmtool/domain'
import { getJson } from 'infrastructure/dataAccess/http/fetch'

export const getMonsterList = async () => {
  const monsterListResult = await getJson<any>({ endpoint: '/monsters' })
  return monsterListResult.results.map((monster: any) => {
    return {
      ...monster,
      id: monster.index,
      source: Source.FifthESRD
    }
  })
}

export const getMonster = async (monsterUrl: string) => {
  return await getJson<any>({ endpoint: monsterUrl.replace('/api', '') })
}
