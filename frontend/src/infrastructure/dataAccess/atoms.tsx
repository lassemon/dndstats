import Character from 'domain/entities/Character'
import { defaultCustomCharacters, defaultCombat, defaultItem, defaultMonster, defaultSpell, defaultWeapon } from 'services/defaults'
import { load, store } from 'services/store'

import { atom as jotaiAtom } from 'jotai'
import { StorageParseError, StorageSyncError } from 'domain/errors/StorageError'

type UpdateFunction<T> = (oldValue: T) => T | undefined
type UpdateParam<T> = UpdateFunction<T> | T

export const errorState = jotaiAtom<Error | null>(null)

type LoadParser<T> = (value: T | null) => T
type SaveParser<T> = (value: T) => { [key: string]: any }

type AsyncStorageParsers<T> = {
  loadParser?: LoadParser<T>
  saveParser?: SaveParser<T>
}

const atomWithAsyncStorage = <T extends unknown>(key: string, initialValue: T, parsers?: AsyncStorageParsers<T>) => {
  const loadParser = parsers?.loadParser ? parsers.loadParser : (value: T | null) => value
  const saveParser = parsers?.saveParser ? parsers.saveParser : (value: T) => value
  const baseAtom = jotaiAtom<T | null>(null)
  baseAtom.onMount = (setValue) => {
    ;(async () => {
      setValue(
        await load<T>(key).then((result) => {
          return result ? loadParser(result) : initialValue
        })
      )
    })()
  }
  const derivedAtom = jotaiAtom(
    (get) => get(baseAtom),
    (get, set, update: UpdateParam<T>) => {
      const oldValue = get(baseAtom)
      if (oldValue) {
        const nextValue = update instanceof Function ? update(oldValue) : (update as T)
        set(baseAtom, nextValue || null)
        if (nextValue) {
          try {
            store(key, saveParser(nextValue))
              .then(() => {
                set(baseAtom, nextValue)
              })
              .catch((error) => {
                console.error(error)
                set(errorState, new StorageSyncError(error && error.message ? error.message : error))
              })
          } catch (error) {
            //console.error(error)
            set(errorState, new StorageParseError(error?.toString()))
          }
        }
      }
    }
  )
  return derivedAtom
}

export const itemState = atomWithAsyncStorage<typeof defaultItem | null>('itemState', defaultItem)

export const spellState = atomWithAsyncStorage<typeof defaultSpell | null>('spellState', defaultSpell)

export const weaponState = atomWithAsyncStorage<typeof defaultWeapon | null>('weaponState', defaultWeapon)

export const monsterState = atomWithAsyncStorage<typeof defaultMonster | null>('monsterState', defaultMonster, {
  loadParser: (monsterInStore) => {
    return monsterInStore ? Character.fromJSON(monsterInStore) : null
  },
  saveParser: (monsterInStore) => {
    return monsterInStore ? monsterInStore.toJSON() : defaultMonster
  }
})

export const combatTrackerState = atomWithAsyncStorage<typeof defaultCombat>('combatTrackerState', defaultCombat, {
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

export const customCharactersState = atomWithAsyncStorage<typeof defaultCustomCharacters>('customCharactersState', defaultCustomCharacters, {
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
