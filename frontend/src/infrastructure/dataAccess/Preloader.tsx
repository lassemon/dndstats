import { useAtomValue } from 'jotai'
import { combatTrackerState, itemState, monsterState, spellState, weaponState } from './atoms'

const Preloader = () => {
  useAtomValue(itemState)
  useAtomValue(spellState)
  useAtomValue(weaponState)
  useAtomValue(monsterState)
  useAtomValue(combatTrackerState)
  return null
}

export default Preloader
