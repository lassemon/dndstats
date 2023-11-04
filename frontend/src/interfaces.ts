export enum Condition {
  Baned = 'baned',
  Blessed = 'blessed',
  BlessedByBard = 'blessed_by_bard',
  Blinded = 'blinded',
  Bloodied = 'bloodied',
  Burning = 'burning',
  Blur = 'blur',
  Charmed = 'charmed',
  Concentration = 'concentration',
  Confused = 'confused',
  Dead = 'dead',
  Deafened = 'deafened',
  Exhausted = 'exhausted',
  Frightened = 'frightened',
  Grappled = 'grabbled',
  Hasted = 'hasted',
  Hex = 'hex',
  Holding_Action = 'holding_action',
  Incapacitated = 'incapacitated',
  Invisible = 'invisible',
  Mage_Armor = 'mage_armor',
  MirrorImage = 'mirror_image',
  Paralyzed = 'paralyzed',
  Petrified = 'petrified',
  Poisoned = 'poisoned',
  Posessed = 'posessed',
  Prone = 'prone',
  Reaction_Used = 'reaction_used',
  Raging = 'raging',
  Restrained = 'restrained',
  Shield_of_Faith = 'shield_of_faith',
  Slowed = 'slowed',
  Stabilized = 'stabilized',
  Stunned = 'stunned',
  Unconscious = 'unconscious'
}

export enum CharacterType {
  Enemy = 'enemy',
  Player = 'player',
  NPC = 'npc'
}

export interface Character {
  init: number
  AC: number
  name: string
  max_hp: number
  hp_cap: number
  current_hit_points: number
  temporary_hit_points: number
  regeneration: number
  conditions: Condition[]
  resistances: DamageType[]
  vulnerabilities: DamageType[]
  immunities: DamageType[]
  type: CharacterType
  effects: any // effects of conditions, e.g. -2 AC
}

export enum DamageType {
  Adamantine = 'adamantine',
  Slashing = 'slashing',
  Piercing = 'piercing',
  Bludgeoning = 'bludgeoning',
  Poison = 'poison',
  Acid = 'acid',
  Fire = 'fire',
  Elemental = 'elemental',
  Cold = 'cold',
  Radiant = 'radiant',
  Necrotic = 'necrotic',
  Lightning = 'lightning',
  Silver = 'silver',
  Thunder = 'thunder',
  Force = 'force',
  Psychic = 'psychic',
  Physical = 'physical',
  Magical = 'magical'
}
