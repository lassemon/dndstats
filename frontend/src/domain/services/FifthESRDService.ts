import { DamageType } from 'interfaces'
import _ from 'lodash'
import { getNumberWithSign } from 'utils/utils'

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

export type Proficiency = {
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

export type ArmorClass = {
  type: string
  value: number
  armor?: APIReference[] // Equipment
}

export type Choice = {
  _id?: boolean
  desc?: string
  choose: number
  type: string
  //from: OptionSet;
}

type Damage = {
  _id?: boolean
  damage_type: APIReference
  damage_dice: string
}

type ActionOption = {
  _id?: boolean
  action_name: string
  count: number | string
  type: 'melee' | 'ranged' | 'ability' | 'magic'
}

type ActionUsage = {
  _id?: boolean
  type: string
  dice?: string
  min_value?: number
}

export type Action = {
  _id?: boolean
  name: string
  desc: string
  attack_bonus?: number
  damage?: Damage[]
  dc?: DifficultyClass
  options?: Choice
  usage?: ActionUsage
  multiattack_type: 'actions' | 'action_options'
  actions: ActionOption[]
  action_options: Choice
}

type Reaction = {
  name: string
  desc: string
  dc?: DifficultyClass
}

export type Sense = {
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
  actions?: Action[]
  armor_class: ArmorClass[]
  challenge_rating: number
  charisma: number
  constitution: number
  damage_immunities: DamageType[]
  damage_resistances: DamageType[]
  damage_vulnerabilities: DamageType[]
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
  proficiency_bonus: number
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

export class FifthESRDService {
  public static parseSkills(proficiencies?: Proficiency[]) {
    return _.filter(proficiencies, (proficiency) => proficiency?.proficiency?.index.includes('skill'))
  }

  public static parseProficiencyLabel(proficiencies?: Proficiency[]) {
    return proficiencies
      ?.map((proficiency) => {
        const proficiencyLabel = proficiency?.proficiency?.index
        const labelParts = proficiencyLabel.split('-')
        return `${labelParts[labelParts.length - 1]} ${getNumberWithSign(proficiency.value)}`
      })
      .join(', ')
  }

  public static parseSavingThrows(proficiencies?: Proficiency[]) {
    return _.filter(proficiencies, (proficiency) => proficiency?.proficiency?.index.includes('saving-throw'))
  }
}
