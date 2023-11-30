import { get } from 'utils/fetch'

export const getMonsterList = async () => {
  return await get('/api/monsters')
}

export const getMonster = async (monsterUrl: string) => {
  return await get(monsterUrl)
}
