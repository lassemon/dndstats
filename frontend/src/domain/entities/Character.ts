import { APIReference, CharacterType, Condition, DamageType, FifthESRDMonster } from 'interfaces'
import ValueObject from './ValueObject'
import _ from 'lodash'
import { ConditionEffects, getConditionEffects } from 'components/CombatTracker/Conditions'
import { getNumberWithSign, upsertToArray } from 'utils/utils'

export interface ArmorClassObject {
  type: string
  value: number
  armor?: APIReference[] // Equipment
}
export interface ICharacter extends Partial<FifthESRDMonster> {
  name: string
  init: number
  armor_classes: ArmorClassObject[]
  hit_points: number
  temporary_hit_points?: number
  damage?: number
  regeneration?: number
  conditions?: Condition[]
  resistances?: DamageType[]
  vulnerabilities?: DamageType[]
  damage_immunities?: DamageType[]
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
  private _resistances
  private _vulnerabilities
  private _damage_immunities
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
      resistances = [],
      vulnerabilities = [],
      damage_immunities = [],
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
    this._resistances = resistances
    this._vulnerabilities = vulnerabilities
    this._damage_immunities = damage_immunities
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

  private parseArmorClassLabel = (armorClass: ArmorClassObject): string => {
    let armorClassLabel = String(armorClass.value)
    if (armorClass.armor) {
      armorClassLabel += ` (${_.get(armorClass.armor, 0).name})` // TODO, why is this an array, can there be more than one?
    }
    return armorClassLabel
  }

  private parseArmorClassLabelWithSign = (armorClass: ArmorClassObject): string => {
    let armorClassLabel = getNumberWithSign(armorClass.value)
    if (armorClass.armor) {
      armorClassLabel += ` (${_.get(armorClass.armor, 0).name})` // TODO, why is this an array, can there be more than one?
    }
    return armorClassLabel
  }

  public set armor_classes(value: ArmorClassObject[]) {
    value.forEach(({ value, type }) => {
      if (type) {
        this._armor_classes = upsertToArray<ArmorClassObject>(this.armor_classes, { type, value }, type as keyof ArmorClassObject)
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
          this._armor_classes = upsertToArray<ArmorClassObject>(this.armor_classes, { type: 'natural', value }, 'natural' as keyof ArmorClassObject)
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

  public get resistances() {
    return this._resistances
  }
  public set resistances(value) {
    this._resistances = value
  }

  public get vulnerabilities() {
    return this._vulnerabilities
  }
  public set vulnerabilities(value) {
    this._vulnerabilities = value
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

  public isUnconscious = () => {
    return this.current_hit_points <= 0
  }

  public isBloodied = () => {
    return this.current_hit_points + this.temporary_hit_points < this.hit_points / 2
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
