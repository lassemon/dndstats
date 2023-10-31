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
  orig_hit_points: number
  current_hit_points: number
  temporary_hit_points: number
  temp_hp_placeholder: number
  damage: string
  conditions: Condition[]
  resistances: DamageType[]
  type: CharacterType
  effects: any
}

export enum DamageType {
  Slashing = 'slashing',
  Piercing = 'piercing',
  Bludgeoning = 'bludgeoning',
  Poison = 'poison',
  Acid = 'acid',
  Fire = 'fire',
  Cold = 'cold',
  Radiant = 'radiant',
  Necrotic = 'necrotic',
  Lightning = 'lightning',
  Thunder = 'thunder',
  Force = 'force',
  Psychic = 'psychic'
}
