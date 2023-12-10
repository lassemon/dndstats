export enum Condition {
  Baned = 'baned',
  Blessed = 'blessed',
  InspiredByBard = 'inspired_by_bard',
  Blinded = 'blinded',
  Bloodied = 'bloodied',
  Burning = 'burning',
  Blur = 'blur',
  Charmed = 'charmed',
  Concentration = 'concentration',
  Confused = 'confused',
  Dead = 'dead',
  Deafened = 'deafened',
  Diseased = 'diseased',
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

export enum Source {
  FifthESRD = '5th_e_SRD',
  HomeBrew = 'Homebrew'
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
