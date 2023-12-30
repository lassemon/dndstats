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
  Exhaustion = 'exhaustion',
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

export enum PlayerType {
  Enemy = 'enemy',
  Player = 'player',
  NPC = 'npc'
}

export enum Size {
  Fine = 'Fine',
  Diminutive = 'Diminutive',
  Tiny = 'Tiny',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  Huge = 'Huge',
  Gargantuan = 'Gargantuan',
  Colossal = 'Colossal'
}

export enum Alignment {
  LawfulGood = 'lawful good',
  NeutralGood = 'neutral good',
  ChaoticGood = 'chaotic good',
  LawfulNeutral = 'lawful neutral',
  TrueNeutral = 'neutral',
  ChaoticNeutral = 'chaotic neutral',
  LawfulEvil = 'lawful evil',
  NeutralEvil = 'neutral evil',
  ChaoticEvil = 'chaotic evil',
  AnyAlignment = 'any alignment',
  Unaligned = 'unaligned'
}

export enum MonsterType {
  BEAST = 'beast',
  MONSTROSITY = 'monstrosity',
  DRAGON = 'dragon',
  HUMANOID = 'humanoid',
  UNDEAD = 'undead',
  FIEND = 'fiend',
  CELESTIAL = 'celestial',
  CONSTRUCT = 'construct',
  GIANT = 'giant',
  ELEMENTAL = 'elemental',
  FEY = 'fey',
  ABERRATION = 'aberration',
  OOZE = 'ooze',
  SWARM = 'swarm',
  PLANT = 'plant'
}

export enum MonsterSubtype {
  ANY_RACE = 'any race',
  HUMAN = 'human',
  DWARF = 'dwarf',
  ELF = 'elf',
  GOBLINOID = 'goblinoid',
  MERFOLK = 'merfolk',
  SHAPECHANGER = 'shapechanger',
  DEMON = 'demon',
  DEVIL = 'devil',
  ORC = 'orc',
  SAHUAGIN = 'sahuagin',
  TITAN = 'titan',
  KOBOLD = 'kobold',
  GNOLL = 'gnoll',
  GRIMLOCK = 'grimlock',
  LIZARDFOLK = 'lizardfolk',
  GNOME = 'gnome'
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
  All_Physical = 'all physical damage',
  All_Magical = 'all magical damage',
  From_Spells = 'damage from spells',
  Not_Silvered = "bludgeoning, piercing, and slashing damage from nonmagical weapons that aren't silvered",
  Not_Adamantine = "bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
  Not_Magical = 'bludgeoning, piercing, and slashing from nonmagical weapons'
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
