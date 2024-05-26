import Character from 'domain/entities/Character'
import { defaultCustomCharacters, defaultCombat, defaultItem, defaultMonster, defaultSpell, defaultWeapon } from 'services/defaults'
import { LocalStorageRepository } from 'infrastructure/repositories/LocalStorageRepository'

import { atom } from 'jotai'
import { StorageParseError, StorageSyncError } from 'domain/errors/StorageError'
import { isPromise } from 'utils/utils'
import { Item } from '@dmtool/domain'
import { UserResponse } from '@dmtool/application'

type UpdateFunction<T> = (oldValue: T) => T | undefined
type UpdateParam<T> = UpdateFunction<T> | T
type DataOrPromise<T> = T | Promise<T>

export interface AuthState {
  user?: UserResponse
  loggedIn: boolean
}

export type CombatAtom = typeof defaultCombat
export type ItemAtom = Item
export type CustomCharactersAtom = typeof defaultCustomCharacters
export interface Success {
  message: string
}

export const errorAtom = atom<Error | null>(null)
export const successAtom = atom<Success | null>(null)

type LoadParser<T> = (value: T) => T
type SaveParser<T> = (value: T) => { [key: string]: any }

type AsyncStorageParsers<T> = {
  loadParser?: LoadParser<T>
  saveParser?: SaveParser<T>
}

const atomWithAsyncStorage = <T extends unknown>(key: string, initialValue: T, parsers?: AsyncStorageParsers<T>) => {
  const localStorageRepository = new LocalStorageRepository<T>()
  const loadParser = parsers?.loadParser ? parsers.loadParser : (value: T) => value
  const saveParser = parsers?.saveParser ? parsers.saveParser : (value: T) => value
  const baseAtom = atom<DataOrPromise<T>>(
    localStorageRepository.getById(key).then((result) => {
      return result ? loadParser(result) : initialValue
    })
  )
  const derivedAtom = atom(
    (get) => get(baseAtom), // do not set this to async, it will cause the page to jump on each re-render
    (get, set, update: UpdateParam<T>) => {
      const getNextValue = (oldValue: T) => {
        const parsedValue = update instanceof Function ? update(oldValue) : (update as T)
        return parsedValue ? parsedValue : oldValue
      }
      const insertToStore = (nextValue: T) => {
        try {
          localStorageRepository
            .save(saveParser(nextValue) as T, key)
            .then(() => {
              set(baseAtom, nextValue)
            })
            .catch((error) => {
              console.error(error)
              set(errorAtom, new StorageSyncError(error && error.message ? error.message : error))
            })
        } catch (error) {
          set(errorAtom, new StorageParseError(error?.toString()))
        }
      }
      const oldValueDataOrPromise = get(baseAtom)
      if (isPromise(oldValueDataOrPromise)) {
        oldValueDataOrPromise.then((oldValue) => {
          const nextValue = getNextValue(oldValue)
          set(baseAtom, nextValue)
          insertToStore(nextValue)
        })
      } else {
        const nextValue = getNextValue(oldValueDataOrPromise)
        set(baseAtom, nextValue)
        insertToStore(nextValue)
      }
    }
  )
  return derivedAtom
}

export const authAtom = atomWithAsyncStorage<AuthState>('authState', { loggedIn: false })

export const BLAAAitemAtom = atomWithAsyncStorage<typeof defaultItem | null>('itemState', defaultItem)

export const spellAtom = atomWithAsyncStorage<typeof defaultSpell | null>('spellState', defaultSpell)

export const weaponAtom = atomWithAsyncStorage<typeof defaultWeapon | null>('weaponState', defaultWeapon)

export const monsterAtom = atomWithAsyncStorage<typeof defaultMonster | null>('monsterState', defaultMonster, {
  loadParser: (monsterInStore) => {
    return monsterInStore ? Character.fromJSON(monsterInStore) : null
  },
  saveParser: (monsterInStore) => {
    return monsterInStore ? monsterInStore.toJSON() : defaultMonster
  }
})

export const combatTrackerAtom = atomWithAsyncStorage<CombatAtom>('combatTrackerState', defaultCombat, {
  loadParser: (state) => {
    return {
      ...defaultCombat,
      ...(state ? { ...state } : {}),
      ...(state ? { characters: state.characters.map((character: any) => Character.fromJSON(character)) } : {})
    }
  },
  saveParser: (state) => {
    return {
      ...state,
      characters: state?.characters.map((character: Character) => character.toJSON())
    }
  }
})

export const customCharactersAtom = atomWithAsyncStorage<typeof defaultCustomCharacters>('customCharactersState', defaultCustomCharacters, {
  loadParser: (state) => {
    return {
      ...defaultCustomCharacters,
      ...(state ? { ...state } : {}),
      ...(state ? { characters: state.characters.map((character) => Character.fromJSON(character)) } : {})
    }
  },
  saveParser: (state) => {
    return {
      ...state,
      ...(state ? { characters: state.characters.map((character) => character.toJSON()) } : {})
    }
  }
})
