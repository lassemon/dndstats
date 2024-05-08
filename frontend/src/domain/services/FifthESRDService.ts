import { FifthESRDAPIReference } from '@dmtool/domain'
import { CharacterSenses, CharacterSpeed, DamageSource } from 'interfaces'
import _ from 'lodash'
import { defaultSavingThrows, defaultSkills } from 'services/defaults'
import { getNumberWithSign } from 'utils/utils'

// D&D 5e SRD API interfaces

type ActionDamage = {
  damage_type: FifthESRDAPIReference
  damage_at_character_level: Record<string, string>
}

type DifficultyClass = {
  dc_type: FifthESRDAPIReference
  dc_value?: number
  success_type: 'none' | 'half' | 'other'
}

export type Proficiency = {
  proficiency: FifthESRDAPIReference
  value: number
}

type LegendaryAction = {
  name: string
  desc: string
  attack_bonus?: number
  damage?: ActionDamage[]
  dc?: DifficultyClass
}

export type ArmorClass =
  | ArmorClassDex
  | ArmorClassNatural
  | ArmorClassArmor
  | ArmorClassSpell
  | ArmorClassCondition
  | { type: string; value: number }

type ArmorClassDex = {
  _id?: boolean
  type: 'dex'
  value: number
  desc?: string
}

type ArmorClassNatural = {
  _id?: boolean
  type: 'natural'
  value: number
  desc?: string
}

type ArmorClassArmor = {
  _id?: boolean
  type: 'armor'
  value: number
  armor?: FifthESRDAPIReference[] // Equipment
  desc?: string
}

type ArmorClassSpell = {
  _id?: boolean
  type: 'spell'
  value: number
  spell: FifthESRDAPIReference // Spell
  desc?: string
}

type ArmorClassCondition = {
  _id?: boolean
  type: 'condition'
  value: number
  condition: FifthESRDAPIReference // Condition
  desc?: string
}

export enum ArmorClassType {
  DEX = 'dex',
  NATURAL = 'natural',
  ARMOR = 'armor',
  SPELL = 'spell',
  CONDITION = 'condition'
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
  damage_type: FifthESRDAPIReference
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
  multiattack_type?: 'actions' | 'action_options'
  actions?: ActionOption[]
  action_options?: Choice
}

type Reaction = {
  name: string
  desc: string
  dc?: DifficultyClass
}

export type Sense = {
  blindsight?: string
  darkvision?: string
  passive_perception: string
  tremorsense?: string
  truesight?: string
}

type SpecialAbilityUsage = {
  _id?: boolean
  type: string
  times?: number
  rest_types?: string[]
}

type SpecialAbilitySpell = {
  _id?: boolean
  name: string
  level: number
  url: string
  notes?: string
  usage?: SpecialAbilityUsage
}

type SpecialAbilitySpellcasting = {
  _id?: boolean
  level?: number
  ability: FifthESRDAPIReference
  dc?: number
  modifier?: number
  components_required: string[]
  school?: string
  slots?: Record<string, number>
  spells: SpecialAbilitySpell[]
}

export type SpecialAbility = {
  _id?: boolean
  name: string
  desc: string
  attack_bonus?: number
  damage?: ActionDamage[]
  dc?: DifficultyClass
  spellcasting?: SpecialAbilitySpellcasting
  usage?: SpecialAbilityUsage
}

export enum AbilityScores {
  STRENGTH = 'strength',
  DEXTERITY = 'dexterity',
  CONSTITUTION = 'constitution',
  INTELLIGENCE = 'intelligence',
  WISDOM = 'wisdom',
  CHARISMA = 'charisma'
}

export type FifthESRDMonster = {
  alignment: string
  actions?: Action[]
  armor_class: ArmorClass[]
  challenge_rating: number
  charisma: number
  constitution: number
  condition_immunities: FifthESRDAPIReference[]
  damage_immunities: DamageSource[]
  damage_resistances: DamageSource[]
  damage_vulnerabilities: DamageSource[]
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
  senses: CharacterSenses
  size: string
  special_abilities?: SpecialAbility[]
  speed: CharacterSpeed
  strength: number
  subtype?: string
  type: string
  url: string
  wisdom: number
  xp: number
  desc?: string
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

  public static parseProficiencyName(proficiency?: Proficiency) {
    const proficiencyIndex = proficiency?.proficiency?.index
    const indexParts = proficiencyIndex?.split('-')
    const nameAcronym = indexParts ? indexParts[indexParts.length - 1] : ''
    switch (nameAcronym.toLowerCase()) {
      case 'str':
        return AbilityScores.STRENGTH
      case 'dex':
        return AbilityScores.DEXTERITY
      case 'con':
        return AbilityScores.CONSTITUTION
      case 'int':
        return AbilityScores.INTELLIGENCE
      case 'wis':
        return AbilityScores.WISDOM
      case 'cha':
        return AbilityScores.CHARISMA
      default:
        return ''
    }
  }

  public static parseProficiencyAcronym(name: string) {
    switch (name) {
      case AbilityScores.STRENGTH:
        return 'str'
      case AbilityScores.DEXTERITY:
        return 'dex'
      case AbilityScores.CONSTITUTION:
        return 'con'
      case AbilityScores.INTELLIGENCE:
        return 'int'
      case AbilityScores.WISDOM:
        return 'wis'
      case AbilityScores.CHARISMA:
        return 'cha'
      default:
        return name
    }
  }

  public static parseSavingThrows(proficiencies?: Proficiency[]) {
    return _.filter(proficiencies, (proficiency) => proficiency?.proficiency?.index.includes('saving-throw'))
  }

  public static convertSavingThrowsToProficiencies(savingThrows: Partial<typeof defaultSavingThrows>): Proficiency[] {
    return Object.entries(savingThrows).map(([key, value]) => {
      return {
        value: parseInt(value.toString()),
        proficiency: {
          index: `saving-throw-${FifthESRDService.parseProficiencyAcronym(key)}`,
          name: `Saving Throw: ${FifthESRDService.parseProficiencyAcronym(key).toUpperCase()}`,
          url: `/api/proficiencies/saving-throw-${FifthESRDService.parseProficiencyAcronym(key)}`
        }
      }
    })
  }

  public static convertSkillsToProficiencies(skills: Partial<typeof defaultSkills>): Proficiency[] {
    return Object.entries(skills).map(([key, value]) => {
      return {
        value: parseInt(value?.toString() || ''),
        proficiency: {
          index: `saving-throw-${FifthESRDService.parseProficiencyAcronym(key)}`,
          name: `Saving Throw: ${FifthESRDService.parseProficiencyAcronym(key).toUpperCase()}`,
          url: `/api/proficiencies/saving-throw-${FifthESRDService.parseProficiencyAcronym(key)}`
        }
      }
    })
  }

  public static parseSkillName(proficiency?: Proficiency) {
    const proficiencyIndex = proficiency?.proficiency?.index
    const indexParts = proficiencyIndex?.split('-')
    return indexParts ? indexParts[indexParts.length - 1] : ''
  }
}
