import { ITEM_DEFAULTS, ItemDTO } from '@dmtool/application'
import { uuid } from '@dmtool/common'
import { Item, Source, Visibility } from '@dmtool/domain'
import balorImage from 'assets/balorImage'
import mjolnirImage from 'assets/mjolnirImage'
import Character from 'domain/entities/Character'
import { AbilityScores } from 'domain/services/FifthESRDService'
import { PlayerType, Condition, DamageType, Skill, Senses, Speed } from 'interfaces'
import React from 'react'
import { unixtimeNow } from 'utils/utils'

export const defaultItem: Item = {
  id: ITEM_DEFAULTS.DEFAULT_ITEM_ID,
  imageId: null,
  name: 'Greatshield of Artorias',
  shortDescription: 'Shield, artifact (requires attunement, 18 str)',
  mainDescription: `Shield beloning to the great Abysswalker, Knight Artorias. Boast consistent defense and divine protection againts various status effects.`,
  features: [
    {
      featureName: 'Magic Shield',
      featureDescription: `While holding this shield you have a bonus of +2 to AC and gain immunity to poison damage.`
    },
    {
      featureName: 'Divine Resistance',
      featureDescription: `You are resistant to fire, force and necrotic damage while wielding this shield.`
    }
  ],
  price: null,
  rarity: null,
  weight: null,
  source: Source.HomeBrew,
  visibility: Visibility.PUBLIC,
  createdBy: '1',
  createdAt: unixtimeNow()
}

export const newItemDTO = new ItemDTO({
  id: uuid(),
  imageId: null,
  name: 'New Item',
  shortDescription: 'Short description',
  mainDescription: 'Main Description',
  features: [
    {
      featureName: 'Feature Name',
      featureDescription: 'Feature Description'
    }
  ],
  price: null,
  rarity: null,
  weight: null,
  source: Source.HomeBrew,
  visibility: Visibility.PRIVATE,
  createdBy: '0',
  createdAt: unixtimeNow()
})

export interface Spell {
  name: string
  shortDescription: string
  mainDescription: string
  features: Array<{ featureName: string; featureDescription: string }>
  athigherlevels: string
  castingtime: string
  range: string
  components: string
  duration: string
  classes: string
}

export const defaultSpell: Spell = {
  name: 'Eldritch Blast',
  shortDescription: 'Evocation cantrip',
  mainDescription: `A beam of crackling energy streaks toward a creature within range. Make a ranged spell Attack against the target. On a hit, the target takes 1d10 force damage.`,
  features: [],
  athigherlevels: `The spell creates more than one beam when you reach higher levels: two beams at 5th Level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate Attack roll for each beam.`,
  castingtime: '1 action',
  range: '120 feet',
  components: 'V, S',
  duration: 'Instantaneous',
  classes: 'Warlock'
}

export const defaultWeapon = {
  image: React.createElement('img', {
    alt: 'mjolnir',
    src: mjolnirImage,
    hash: 0
  }),
  name: 'Mjölnir',
  shortDescription: 'Whoever holds this hammer shall posess the power of Thor.',
  mainDescription: `This hammer has the finesse property.
While attuned to this weapon the hammer deals additional 12 (4d6) thunder damage.`,
  features: [
    {
      featureName: 'Weight of the World',
      featureDescription: `While attuned you feel the weight of the world on your shoulders.
At the end of each round throw a constitution save DC 14.
On a failed save you become exhausted (level of 3) for the duration of the next round.`
    }
  ],
  damage: '2d6 + DEX modifier Bludgeoning damage',
  weight: '2 lb.',
  properties: 'Light, finesse, +4d6 thunder damage'
}
export type Weapon = typeof defaultWeapon

export const defaultMonster = new Character({
  imageElement: React.createElement('img', {
    alt: 'balor',
    src: balorImage,
    hash: 0
  }),
  id: 'balor',
  name: 'Balor',
  source: Source.HomeBrew,
  size: 'Huge',
  type: 'fiend',
  subtype: 'demon',
  alignment: 'chaotic evil',
  description: `Balors were imposing humanoid figures that stood about 12 feet (3.6 meters) tall and weighed 4,500 pounds (2041.1 kilograms). A powerful aura of darkness enveloped their grotesque forms, as their deep red skin was wrapped in glaring flames. A pair of massive bat-like wings allowed them to soar throughout the air with unnatural agility. Although they were naturally armed with venom-dripping fangs and fearsome claws, they were also normally armed with a sword of lightning and a multi-tailed whip of flame.`,
  armor_classes: [
    {
      type: 'natural',
      value: 19
    }
  ],
  hit_points: 262,
  speed: {
    walk: '40ft',
    fly: '80 ft.'
  },
  strength: 26,
  dexterity: 15,
  constitution: 22,
  intelligence: 20,
  wisdom: 16,
  charisma: 22,
  skills: [
    {
      proficiency: { index: 'skill-intimidation', name: 'Intimidation' },
      value: 6
    }
  ],
  saving_throws: [
    { proficiency: { index: 'saving-throw-strenght', name: 'Strenght' }, value: 14 },
    { proficiency: { index: 'saving-throw-constitution', name: 'Constitution' }, value: 12 },
    { proficiency: { index: 'saving-throw-charisma', name: 'Charisma' }, value: 12 }
  ],
  damage_resistances: [
    DamageType.Cold,
    DamageType.Lightning,
    DamageType.Bludgeoning,
    DamageType.Piercing,
    'and Slashing from nonmagical Attacks' as DamageType
  ] as DamageType[],
  damage_immunities: [DamageType.Fire, DamageType.Poison],
  condition_immunities: [{ index: Condition.Poisoned, name: Condition.Poisoned }],
  senses: {
    truesight: '120 ft.',
    passive_perception: '13'
  },
  languages: 'Abyssal, Telepathy 120 ft.',
  challenge_rating: 19,
  xp: 22000,
  special_abilities: [
    {
      name: 'Death Throes',
      desc: `When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much damage on a successful one. The explosion ignites flammable objects in that area that aren't being worn or carried, and it destroys the balor's weapons.`
    },
    {
      name: 'Fire Aura',
      desc: `At the start of each of the balor's turns, each creature within 5 feet of it takes 10 (3d6) fire damage, and flammable objects in the aura, that aren't being worn or carried, ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it, takes 10 (3d6) fire damage.`
    },
    {
      name: 'Magic Resistance',
      desc: 'The balor has advantage on saving throws againts spells and other magical effects.'
    },
    {
      name: 'Magic Weapons',
      desc: "The balor's weapon attacks are magical."
    }
  ],
  actions: [
    {
      name: 'Multiattack',
      desc: 'The balor makes two attacks: one with its longsword and one with its whip.'
    },
    {
      name: 'Longsword',
      desc: 'Melee Weapon Attack, +14 to hit, reach 10ft., one target. Hit: (3d8 + 8) slashing damage plus (3d8) lightning damage. If the balor scores a critical hit, it rolls the damage dice three times, instead of twice.'
    },
    {
      name: 'Whip',
      desc: 'Melee Weapon Attack: +14 to hit, reach 30ft., one target. Hit: (2d6 + 8) slashing damage plus (3d6) fire damage. The target must succeed on a DC 20 Strenght saving throw or be pulled up to 25 feet toward the balor.'
    },
    {
      name: 'Teleport',
      desc: 'The balor magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.'
    }
  ],
  reactions: [
    {
      name: 'Howl of the Pit',
      desc: 'Whenever a creature the balor can see, targets it with a spell, the balor bellows a terrible roar into the air. The spellcaster must make a DC 16 Wisdom saving throw. On a failed save the targets spell fails.'
    }
  ]
})
export type Monster = typeof defaultMonster

export const defaultCombat = {
  ongoing: false,
  turn: 0,
  round: 1,
  characters: [
    new Character({
      id: 'ogi',
      name: 'Ogi',
      init: 12,
      armor_classes: [{ type: 'natural', value: 15 }],
      hit_points: 35,
      player_type: PlayerType.Player,
      source: Source.HomeBrew
    }),
    new Character({
      id: 'thoongk',
      name: 'Thoongk',
      init: 5,
      armor_classes: [{ type: 'natural', value: 16 }],
      hit_points: 55,
      player_type: PlayerType.Player,
      source: Source.HomeBrew
    }),
    new Character({
      id: 'erig',
      name: 'Erig',
      init: 3,
      armor_classes: [{ type: 'natural', value: 15 }],
      hit_points: 19,
      player_type: PlayerType.NPC,
      source: Source.HomeBrew
    }),
    new Character({
      id: 'klani',
      name: 'Klani',
      init: 19,
      armor_classes: [{ type: 'natural', value: 16 }],
      hit_points: 61,
      player_type: PlayerType.NPC,
      source: Source.HomeBrew
    }),
    new Character({
      id: 'beor',
      name: 'Beor',
      init: 15,
      armor_classes: [{ type: 'natural', value: 15 }],
      hit_points: 57,
      player_type: PlayerType.NPC,
      source: Source.HomeBrew
    }),
    new Character({
      id: 'orc',
      name: 'Orc',
      init: 15,
      armor_classes: [{ type: 'natural', value: 13 }],
      hit_points: 15,
      source: Source.HomeBrew
    }),
    new Character({
      id: 'goblin',
      name: 'Goblin',
      init: 4,
      armor_classes: [{ type: 'natural', value: 15 }],
      hit_points: 7,
      source: Source.HomeBrew
    })
  ]
}
export type Combat = typeof defaultCombat

export const defaultCustomCharacters = {
  characters: [] as Character[]
}

export const defaultAbilityScores = {
  ...Object.values(AbilityScores).reduce((accumulator, key) => {
    accumulator[key] = 10
    return accumulator
  }, {} as { [key in AbilityScores]: number } & {})
}

export const defaultSavingThrows = {
  strength: '',
  dexterity: '',
  constitution: '',
  intelligence: '',
  wisdom: '',
  charisma: '',
  death: ''
}

export const defaultSpeed = Object.values(Speed).reduce((accumulator, speedKey) => {
  accumulator[speedKey] = ''
  return accumulator
}, {} as Character['speed'] & {})

export const defaultSkills = Object.values(Skill).reduce((defaultSkills, skill) => {
  defaultSkills[skill] = ''
  return defaultSkills
}, {} as { [key: string]: string })

export const defaultSenses = Object.values(Senses).reduce((defaultSenses, sense) => {
  defaultSenses[sense] = ''
  return defaultSenses
}, {} as { [key: string]: string })
