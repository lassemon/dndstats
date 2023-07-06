export enum Condition {
  Bloodied = 'bloodied',
  Dead = 'dead',
  Blinded = 'blinded',
  Charmed = 'charmed',
  Deafened = 'deafened',
  Frightened = 'frightened',
  Grappled = 'grabbled',
  Incapacitated = 'incapacitated',
  Invisible = 'invisible',
  Paralyzed = 'paralyzed',
  Petrified = 'petrified',
  Poisoned = 'poisoned',
  Prone = 'prone',
  Restrained = 'restrained',
  Stunned = 'stunned',
  Unconscious = 'unconscious',
  Stabilized = 'stabilized',
  Shield_of_Faith = 'shield_of_faith',
  Reaction_Used = 'reaction_used',
  Posessed = 'posessed',
  Mage_Armor = 'mage_armor',
  Holding_Action = 'holding_action',
  Hex = 'hex',
  Hasted = 'hasted',
  Concentration = 'concentration',
  Blessed = 'blessed',
  Baned = 'baned'
}

export enum CharacterType {
  Enemy = 'enemy',
  PC = 'pc'
}

export interface Character {
  init: number
  name: string
  orig_hit_points: number
  current_hit_points: number
  damage: string
  conditions: Condition[]
  type: CharacterType
}
