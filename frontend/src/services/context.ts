import Character from 'domain/entities/Character'
import { createContext } from 'react'
import { defaultMonster } from './defaults'

type CharacterCardContextType = {
  character: Character
  setCharacter: (newCharacter: Character) => void
}

export const CharacterCardContext = createContext<CharacterCardContextType>({ character: defaultMonster, setCharacter: () => {} })
