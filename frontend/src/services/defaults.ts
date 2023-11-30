import balorImage from 'assets/balorImage'
import mjolnirImage from 'assets/mjolnirImage'
import shieldImage from 'assets/shieldImage'
import Character from 'domain/entities/Character'
import { CharacterType } from 'interfaces'
import React from 'react'

export const defaultItem = {
  image: React.createElement('img', {
    alt: 'greatshield',
    src: shieldImage,
    hash: 0
  }),
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
  ]
}

export const defaultSpell = {
  name: 'Eldritch Blast',
  shortDescription: 'Evocation cantrip',
  mainDescription: `A beam of crackling energy streaks toward a creature within range. Make a ranged spell Attack against the target. On a hit, the target takes 1d10 force damage.`,
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

export const defaultMonster = {
  image: React.createElement('img', {
    alt: 'balor',
    src: balorImage,
    hash: 0
  }),
  name: 'Balor',
  shortDescription: 'Huge fiend (demon), chaotic evil',
  mainDescription: `Balors were imposing humanoid figures that stood about 12 feet (3.6 meters) tall and weighed 4,500 pounds (2041.1 kilograms). A powerful aura of darkness enveloped their grotesque forms, as their deep red skin was wrapped in glaring flames. A pair of massive bat-like wings allowed them to soar throughout the air with unnatural agility. Although they were naturally armed with venom-dripping fangs and fearsome claws, they were also normally armed with a sword of lightning and a multi-tailed whip of flame.`,
  AC: '19 (Natural Armor)',
  HP: '262 (21d12+126)',
  speed: '40ft, fly 80 ft.',
  STR: '26 (+8)',
  DEX: '15 (+2)',
  CON: '22 (+6)',
  INT: '20 (+5)',
  WIS: '16 (+3)',
  CHA: '22 (+6)',
  skills: 'Intimidation +6',
  savingthrows: 'Str +14, Con +12, Cha +12',
  resistance: 'Cold, Lightning, Bludgeoning, Piercing and Slashing from nonmagical Attacks',
  damageimmunities: 'Fire, Poison',
  conditionimmunities: 'Poisoned',
  senses: 'Truesight 120 ft., Passive Perception 13',
  languages: 'Abyssal, Telepathy 120 ft.',
  challenge: '19 (22 000 XP)',
  features: [
    {
      name: 'Death Throes',
      description: `When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much damage on a successful one. The explosion ignites flammable objects in that area that aren't being worn or carried, and it destroys the balor's weapons.`
    },
    {
      name: 'Fire Aura',
      description: `At the start of each of the balor's turns, each creature within 5 feet of it takes 10 (3d6) fire damage, and flammable objects in the aura, that aren't being worn or carried, ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it, takes 10 (3d6) fire damage.`
    },
    {
      name: 'Magic Resistance',
      description: 'The balor has advantage on saving throws againts spells and other magical effects.'
    },
    {
      name: 'Magic Weapons',
      description: "The balor's weapon attacks are magical."
    }
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The balor makes two attacks: one with its longsword and one with its whip.'
    },
    {
      name: 'Longsword',
      description:
        'Melee Weapon Attack, +14 to hit, reach 10ft., one target. Hit: (3d8 + 8) slashing damage plus (3d8) lightning damage. If the balor scores a critical hit, it rolls the damage dice three times, instead of twice.'
    },
    {
      name: 'Whip',
      description:
        'Melee Weapon Attack: +14 to hit, reach 30ft., one target. Hit: (2d6 + 8) slashing damage plus (3d6) fire damage. The target must succeed on a DC 20 Strenght saving throw or be pulled up to 25 feet toward the balor.'
    },
    {
      name: 'Teleport',
      description: 'The balor magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.'
    }
  ],
  reactions: [
    {
      name: 'Howl of the Pit',
      description:
        'Whenever a creature the balor can see, targets it with a spell, the balor bellows a terrible roar into the air. The spellcaster must make a DC 16 Wisdom saving throw. On a failed save the targets spell fails.'
    }
  ]
}

export const defaultCombat = {
  characters: [
    new Character({
      name: 'Ogi',
      init: 12,
      armor_classes: [{ type: 'natural', value: 15 }],
      hit_points: 35,
      player_type: CharacterType.Player
    }),
    new Character({
      name: 'Thoongk',
      init: 5,
      armor_classes: [{ type: 'natural', value: 16 }],
      hit_points: 55,
      player_type: CharacterType.Player
    }),
    new Character({
      name: 'Erig',
      init: 3,
      armor_classes: [{ type: 'natural', value: 15 }],
      hit_points: 19,
      player_type: CharacterType.NPC
    }),
    new Character({
      name: 'Klani',
      init: 19,
      armor_classes: [{ type: 'natural', value: 16 }],
      hit_points: 61,
      player_type: CharacterType.NPC
    }),
    new Character({
      name: 'Beor',
      init: 15,
      armor_classes: [{ type: 'natural', value: 15 }],
      hit_points: 57,
      player_type: CharacterType.NPC
    }),
    new Character({
      name: 'Orc',
      init: 15,
      armor_classes: [{ type: 'natural', value: 13 }],
      hit_points: 15
    }),
    new Character({
      name: 'Goblin',
      init: 4,
      armor_classes: [{ type: 'natural', value: 15 }],
      hit_points: 7
    })
  ]
}
