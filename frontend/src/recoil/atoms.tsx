import { atom } from 'recoil'
import { defaultCombat, defaultItem, defaultMonster, defaultSpell, defaultWeapon } from 'services/defaults'
import { clear, load, store } from 'services/store'

const localStorageEffect =
  (key: string, defaultState: any) =>
  ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
    setSelf(load(key).then((savedState) => (savedState ? savedState : defaultState)))

    onSet((newValue: any, _: any, isReset: boolean) => {
      isReset ? clear(key) : store(key, newValue)
    })
  }

export const weaponState = atom<typeof defaultWeapon>({
  key: 'weaponState',
  effects: [localStorageEffect('weaponState', defaultWeapon)]
})

export const itemState = atom<typeof defaultItem>({
  key: 'itemState',
  effects: [localStorageEffect('itemState', defaultItem)]
})

export const spellState = atom<typeof defaultSpell>({
  key: 'spellState',
  effects: [localStorageEffect('spellState', defaultSpell)]
})

export const monsterState = atom<typeof defaultMonster>({
  key: 'monsterState',
  effects: [localStorageEffect('monsterState', defaultMonster)]
})

export const combatTrackerState = atom<typeof defaultCombat>({
  key: 'combatTrackerState',
  effects: [localStorageEffect('combatTrackerState', defaultCombat)]
})
