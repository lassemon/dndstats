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

// D&D 5e SRD API interfaces
export type APIReference = {
  index: string
  name: string
  url: string
}

type ActionDamage = {
  damage_type: APIReference
  damage_at_character_level: Record<string, string>
}

type DifficultyClass = {
  dc_type: APIReference
  dc_value?: number
  success_type: 'none' | 'half' | 'other'
}

type Proficiency = {
  proficiency: APIReference
  value: number
}

type LegendaryAction = {
  name: string
  desc: string
  attack_bonus?: number
  damage?: ActionDamage[]
  dc?: DifficultyClass
}

type ArmorClass = {
  type: string
  value: number
  armor?: APIReference[] // Equipment
}

type Reaction = {
  name: string
  desc: string
  dc?: DifficultyClass
}

type Sense = {
  blindsight?: string
  darkvision?: string
  passive_perception: number
  tremorsense?: string
  truesight?: string
}

type Speed = {
  burrow?: string
  climb?: string
  fly?: string
  hover?: string
  swim?: string
  walk?: string
}

export type FifthESRDMonster = {
  alignment: string
  armor_class: ArmorClass[]
  challenge_rating: number
  charisma: number
  constitution: number
  damage_immunities: DamageType[]
  damage_resistances: string[]
  damage_vulnerabilities: string[]
  dexterity: number
  hit_dice: string
  hit_points: number
  hit_points_roll: string
  image?: string
  index: string
  intelligence: number
  languages: string
  legendary_actions?: LegendaryAction[]
  name: string
  proficiencies: Proficiency[]
  reactions?: Reaction[]
  senses: Sense
  size: string
  speed: Speed
  strength: number
  subtype?: string
  type: string
  url: string
  wisdom: number
  xp: number
}
