import { CharacterType, Condition, DamageType } from 'interfaces'
import ValueObject from './ValueObject'
import _ from 'lodash'
import { ConditionEffects, getConditionEffects } from 'components/CombatTracker/Conditions'
import { getNumberWithSign, upsertToArray } from 'utils/utils'
import { Action, ArmorClass, FifthESRDMonster, FifthESRDService, Proficiency, Sense } from 'domain/services/FifthESRDService'

export interface ICharacter extends Partial<FifthESRDMonster> {
  name: string
  init: number
  armor_classes: ArmorClass[]
  hit_points: number
  temporary_hit_points?: number
  damage?: number
  regeneration?: number
  conditions?: Condition[]
  damage_resistances?: DamageType[]
  damage_vulnerabilities?: DamageType[]
  damage_immunities?: DamageType[]
  skills?: Proficiency[]
  senses?: Sense
  languages?: string
  proficiency_bonus?: number
  challenge_rating?: number
  xp?: number
  actions?: Action[]
  saving_throws?: Proficiency[]
  player_type?: CharacterType
  effects?: any
}

class Character extends ValueObject {
  private _name = ''
  private _init
  private _armor_classes
  private _hit_points
  private _temporary_hit_points
  private _damage
  private _regeneration
  private _conditions
  private _damage_resistances
  private _damage_vulnerabilities
  private _damage_immunities
  private _skills
  private _saving_throws
  private _senses
  private _languages
  private _proficiency_bonus
  private _challenge_rating
  private _xp
  private _actions
  private _player_type
  private _effects

  private _strength
  private _dexterity
  private _constitution
  private _intelligence
  private _wisdom
  private _charisma

  private _speed

  constructor(character: ICharacter) {
    const {
      name = '',
      init = 10,
      armor_classes = [{ type: 'natural', value: 10 }],
      hit_points = 10,
      temporary_hit_points = 0,
      damage = 0,
      regeneration = 0,
      conditions = [],
      damage_resistances = [],
      damage_vulnerabilities = [],
      damage_immunities = [],
      skills = [],
      saving_throws = [],
      senses = {},
      languages = '',
      proficiency_bonus = 0,
      challenge_rating = 0,
      xp = 0,
      actions = [],
      player_type = CharacterType.Enemy,
      effects = {},

      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
      speed
    } = character
    super()
    this._name = name
    this._init = init
    this._armor_classes = armor_classes
    this._hit_points = hit_points
    this._temporary_hit_points = temporary_hit_points
    this._damage = Math.abs(damage) // turn damage always into positive integer
    this._regeneration = regeneration
    this._conditions = conditions
    this._damage_resistances = damage_resistances
    this._damage_vulnerabilities = damage_vulnerabilities
    this._damage_immunities = damage_immunities
    this._skills = _.isEmpty(skills) ? FifthESRDService.parseSkills(character.proficiencies) : skills
    this._saving_throws = _.isEmpty(saving_throws) ? FifthESRDService.parseSavingThrows(character.proficiencies) : saving_throws
    this._senses = senses
    this._languages = languages
    this._proficiency_bonus = proficiency_bonus
    this._challenge_rating = challenge_rating
    this._xp = xp
    this._actions = actions
    this._player_type = player_type
    this._effects = effects

    this._strength = strength
    this._dexterity = dexterity
    this._constitution = constitution
    this._intelligence = intelligence
    this._wisdom = wisdom
    this._charisma = charisma

    this._speed = speed
  }

  private getArmorClassesFromConditions(conditions: Condition[]) {
    return conditions.reduce((acsFromConditions, condition) => {
      const conditionEffect = ConditionEffects[condition]
      if (conditionEffect && conditionEffect.AC) {
        acsFromConditions.push({ type: condition, value: conditionEffect.AC })
      }
      return acsFromConditions
    }, [] as ICharacter['armor_classes'])
  }

  public clone(attributes?: Partial<ICharacter>) {
    const cloneAttrs = {
      ...this.toJSON(),
      ...attributes
    }
    return new Character(cloneAttrs)
  }

  public get name() {
    return this._name
  }
  public set name(value) {
    this._name = value
  }

  public get armor_classes(): ICharacter['armor_classes'] {
    return [...this._armor_classes, ...this.getArmorClassesFromConditions(this.conditions)]
  }
  public get armor_class(): number {
    let acSum = 0
    this.armor_classes.forEach((ac) => {
      acSum += typeof ac.value === 'number' ? ac.value : 0
    })
    return acSum
  }
  public get armor_class_label(): string {
    const baseArmorClass = _.find(this.armor_classes, { type: 'natural' }) || _.get(this.armor_classes, 0) || [{ type: 'natural', value: 0 }]
    const armorClassesWithoutBase = _.without(this.armor_classes, baseArmorClass)

    return `${this.parseArmorClassLabel(baseArmorClass)} ${
      armorClassesWithoutBase.length > 0 ? armorClassesWithoutBase.reduce((sum, current) => (sum += ' ' + this.parseArmorClassLabelWithSign(current)), '') : ''
    }`
  }

  private parseArmorClassLabel = (armorClass: ArmorClass): string => {
    let armorClassLabel = String(armorClass.value)
    if (armorClass.armor) {
      armorClassLabel += ` (${_.get(armorClass.armor, 0).name})` // TODO, why is this an array, can there be more than one?
    }
    return armorClassLabel
  }

  private parseArmorClassLabelWithSign = (armorClass: ArmorClass): string => {
    let armorClassLabel = getNumberWithSign(armorClass.value)
    if (armorClass.armor) {
      armorClassLabel += ` (${_.get(armorClass.armor, 0).name})` // TODO, why is this an array, can there be more than one?
    }
    return armorClassLabel
  }

  public set armor_classes(value: ArmorClass[]) {
    value.forEach(({ value, type }) => {
      if (type) {
        this._armor_classes = upsertToArray<ArmorClass>(this.armor_classes, { type, value }, type as keyof ArmorClass)
      } else {
        // if no type is given, let's update the natural armor
        let element
        for (let index = 0, length = this._armor_classes.length; index < length; ++index) {
          const thisElement = this._armor_classes[index]
          if (thisElement.type === 'natural') {
            element = thisElement
            break
          }
        }
        if (element) {
          element.value = value
        } else {
          this._armor_classes = upsertToArray<ArmorClass>(this.armor_classes, { type: 'natural', value }, 'natural' as keyof ArmorClass)
        }
      }
    })
  }

  public get damage() {
    return this._damage
  }
  public set damage(newDamage) {
    const tryingToDamageMoreThanMaxHealth = newDamage > this.hit_points
    const tryingtoHealAboveMaxHealth = newDamage < 0

    if (tryingToDamageMoreThanMaxHealth) {
      this._damage = this.hit_points
    } else if (tryingtoHealAboveMaxHealth) {
      this._damage = 0
    } else {
      this._damage = newDamage
    }

    this.parseConditions()
  }

  public get hit_points() {
    return this._hit_points
  }
  public get current_hit_points() {
    const hp = this.hit_points - this.damage
    return hp < 0 ? 0 : hp
  }
  public get hit_points_cap() {
    return this.hit_points + this.temporary_hit_points
  }
  public set hit_points(value) {
    this._hit_points = value
    this._temporary_hit_points = 0
    this._damage = 0
    this.parseConditions()
  }

  public get init() {
    return this._init
  }
  public set init(value) {
    this._init = value
  }

  public get conditions() {
    return this._conditions
  }

  public set conditions(newConditions) {
    const conditionsToRemove = _.difference(this.conditions, newConditions).filter((condition) => {
      return condition !== Condition.Bloodied && condition !== Condition.Dead && condition !== Condition.Unconscious
    })
    if (!_.isEmpty(conditionsToRemove)) {
      this.removeConditions(conditionsToRemove)
    } else {
      if (newConditions.includes(Condition.Unconscious)) {
        this._conditions = [Condition.Unconscious]
      } else {
        this._conditions = _.uniq([...this._conditions, ...newConditions])
      }
    }
    this._effects = getConditionEffects(this.conditions)
  }

  public parseConditions() {
    this.isBloodied()
      ? (this._conditions = _.uniq([...this._conditions, Condition.Bloodied]))
      : (this._conditions = _.uniq(_.without(this._conditions, Condition.Bloodied)))
    this.isUnconscious() ? (this._conditions = _.uniq([...this._conditions, Condition.Unconscious])) : this.awakeFromUnconciousness()
    // TODO, this.isDead() ? this._conditions = [Condition.Dead] : null
  }

  public setCondition(conditionToAdd: Condition) {
    this.conditions = [conditionToAdd]
  }

  public awakeFromUnconciousness() {
    // remove Dead from here once unconcious is the new dead
    this._conditions = _.uniq(_.without(this._conditions, ...[Condition.Dead, Condition.Unconscious]))
  }

  public removeCondition(conditionToRemove: Condition) {
    if (![Condition.Dead, Condition.Bloodied, Condition.Unconscious].includes(conditionToRemove)) {
      this._conditions = _.uniq(_.without(this._conditions, conditionToRemove))
    }
  }

  public removeConditions(conditionsToRemove: Condition[]) {
    this._conditions = _.uniq(_.without(this._conditions, ..._.without(conditionsToRemove, ...[Condition.Bloodied, Condition.Dead, Condition.Unconscious])))
  }

  public get temporary_hit_points() {
    return this._temporary_hit_points
  }
  public set temporary_hit_points(value) {
    this._temporary_hit_points = value
    this.parseConditions()
  }

  public get regeneration() {
    return this._regeneration
  }
  public set regeneration(value) {
    this._regeneration = value
  }

  public get damage_resistances() {
    return this._damage_resistances
  }
  public set damage_resistances(value) {
    this._damage_resistances = value
  }

  public get damage_vulnerabilities() {
    return this._damage_vulnerabilities
  }
  public set damage_vulnerabilities(value) {
    this._damage_vulnerabilities = value
  }

  public get damage_immunities() {
    return this._damage_immunities
  }
  public set damage_immunities(value) {
    this._damage_immunities = value
  }

  public get player_type() {
    return this._player_type
  }
  public set player_type(value) {
    this._player_type = value
  }

  public get effects() {
    return this._effects
  }
  public set effects(value) {
    this._effects = value
  }

  public heal(amount: string | number) {
    const healAmount = parseInt(String(amount))
    const hasTakenDamage = this.damage > 0
    if (hasTakenDamage) {
      this.damage = this.damage - healAmount
    }
    this.parseConditions()
  }

  public takeDamage(amount: string | number) {
    const damageAmount = Math.abs(parseInt(String(amount))) // turn damage always into positive integer

    if (damageAmount !== 0 && !isNaN(damageAmount)) {
      const hasTemporaryHp = this.temporary_hit_points > 0

      if (hasTemporaryHp) {
        const newTempHp = this.temporary_hit_points - damageAmount
        const damageCarriesOver = newTempHp < 0
        this.temporary_hit_points = damageCarriesOver ? 0 : newTempHp
        if (damageCarriesOver) {
          this.damage = this.damage + Math.abs(newTempHp)
        }
      } else {
        this.damage = this.damage + damageAmount
      }
      this.parseConditions()
    }
  }

  public get speed() {
    return this._speed
  }
  public set speed(value) {
    this._speed = value
  }

  public get strength() {
    return this._strength
  }
  public get strenght_label() {
    return `${this._strength} (${this.calculateAbilityScoreModifier(this._strength)})`
  }
  public set strength(value) {
    this._strength = value
  }

  public get dexterity() {
    return this._dexterity
  }
  public get dexterity_label() {
    return `${this._dexterity} (${this.calculateAbilityScoreModifier(this._dexterity)})`
  }
  public set dexterity(value) {
    this._dexterity = value
  }

  public get constitution() {
    return this._constitution
  }
  public get constitution_label() {
    return `${this._constitution} (${this.calculateAbilityScoreModifier(this._constitution)})`
  }
  public set constitution(value) {
    this._constitution = value
  }

  public get intelligence() {
    return this._intelligence
  }
  public get intelligence_label() {
    return `${this._intelligence} (${this.calculateAbilityScoreModifier(this._intelligence)})`
  }
  public set intelligence(value) {
    this._intelligence = value
  }

  public get wisdom() {
    return this._wisdom
  }
  public get wisdom_label() {
    return `${this._wisdom} (${this.calculateAbilityScoreModifier(this._wisdom)})`
  }
  public set wisdom(value) {
    this._wisdom = value
  }

  public get charisma() {
    return this._charisma
  }
  public get charisma_label() {
    return `${this._charisma} (${this.calculateAbilityScoreModifier(this._charisma)})`
  }
  public set charisma(value) {
    this._charisma = value
  }

  private calculateAbilityScoreModifier = (score?: number): string => {
    const modifier = Math.floor(((score || 0) - 10) / 2)
    return getNumberWithSign(modifier)
  }

  public hasAbilityScores = () => {
    return this.strength || this.dexterity || this.constitution || this.intelligence || this.wisdom || this.charisma
  }

  public get skills() {
    return this._skills
  }
  public get skills_label() {
    return FifthESRDService.parseProficiencyLabel(this.skills)
  }
  public set skills(value) {
    this._skills = value
  }

  public get saving_throws() {
    return this._saving_throws
  }
  public get saving_throws_label() {
    return FifthESRDService.parseProficiencyLabel(this.saving_throws)
  }
  public set saving_throws(value) {
    this._saving_throws = value
  }

  public get senses() {
    return this._senses
  }
  public get senses_label() {
    return Object.entries(this._senses)
      .map(([key, value]) => `${key.replace('_', ' ')} ${value}`)
      .join(', ')
  }
  public set senses(value) {
    this._senses = value
  }

  public get languages() {
    return this._languages
  }
  public set languages(value) {
    this._languages = value
  }

  public get proficiency_bonus() {
    return this._proficiency_bonus
  }
  public get proficiency_bonus_label() {
    return getNumberWithSign(this.proficiency_bonus)
  }
  public set proficiency_bonus(value) {
    this._proficiency_bonus = value
  }

  public get challenge_rating() {
    return this._challenge_rating
  }
  public get challenge_rating_label() {
    return `${this._challenge_rating}${this.xp ? ` (${this.xp} XP)` : ''}`
  }
  public set challenge_rating(value) {
    this._challenge_rating = value
  }

  public get xp() {
    return this._xp
  }
  public set xp(value) {
    this._xp = value
  }

  public get actions() {
    return this._actions
  }
  public set actions(value) {
    this._actions = value
  }

  public isUnconscious = () => {
    return this.current_hit_points <= 0
  }

  public isBloodied = () => {
    return this.current_hit_points + this.temporary_hit_points < this.hit_points / 2
  }

  public static fromJSON(character: { [key: string]: any }) {
    character = Object.entries(character).reduce((object, entry) => {
      object[entry[0][0] === '_' ? entry[0].replace('_', '') : entry[0]] = entry[1]
      return object
    }, {} as { [key: string]: string })

    if (typeof character.AC === 'number') {
      character.armor_classes = [{ type: 'natural', value: character.AC }]
      delete character.AC
    }
    if (typeof character.current_hit_points === 'number') {
      character.damage = character.max_hp - character.current_hit_points
      character.hit_points = character.max_hp
      delete character.current_hit_points
      delete character.current_hit_points
      delete character.max_hp
    }
    if (typeof character.type === 'string') {
      character.player_type = character.type
      delete character.type
    }
    if (character.effects['AC']) {
      character.effects['armor_class'] = character.effects.AC
      delete character.effects.AC
    }

    character.damage = Math.abs(character.damage) // turn damage always into positive integer

    return new Character(character as ICharacter)
  }

  public toJSON(): ICharacter {
    return {
      ...Object.entries(this).reduce((object, entry) => {
        object[entry[0].replace('_', '')] = entry[1]
        return object
      }, {} as { [key: string]: any })
    } as ICharacter
  }

  public toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default Character
