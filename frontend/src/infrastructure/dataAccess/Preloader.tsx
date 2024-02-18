import { useAtomValue } from 'jotai'
import { combatTrackerAtom, customCharactersAtom, itemAtom, monsterAtom, spellAtom, weaponAtom } from './atoms'

const Preloader = () => {
  useAtomValue(itemAtom)
  useAtomValue(spellAtom)
  useAtomValue(weaponAtom)
  useAtomValue(monsterAtom)
  useAtomValue(combatTrackerAtom)
  useAtomValue(customCharactersAtom)
  return null
}

export default Preloader
