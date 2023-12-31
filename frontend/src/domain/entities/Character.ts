import { PlayerType, Condition, DamageType, Source, CharacterSenses } from 'interfaces'
import ValueObject from './ValueObject'
import _, { capitalize } from 'lodash'
import { ConditionEffects, getConditionEffects, getPrintableConditions } from 'components/CombatTracker/Conditions'
import { getNumberWithSign, upsertToArray, uuid } from 'utils/utils'
import { Action, ArmorClass, ArmorClassType, FifthESRDMonster, FifthESRDService, Proficiency, SpecialAbility } from 'domain/services/FifthESRDService'
import { ReactElement } from 'react'
export interface ICharacter extends Partial<FifthESRDMonster> {
  id?: string
  index?: string
  name: string
  init?: number
  armor_classes: ArmorClass[]
  hit_points: number
  temporary_hit_points?: number
  damage?: number
  regeneration?: number
  conditions?: Condition[]
  damage_immunities?: DamageType[]
  damage_resistances?: DamageType[]
  damage_vulnerabilities?: DamageType[]
  skills?: Proficiency[]
  special_abilities?: SpecialAbility[]
  senses?: CharacterSenses
  languages?: string
  proficiency_bonus?: number
  challenge_rating?: number
  xp?: number
  actions?: Action[]
  saving_throws?: Proficiency[]
  player_type?: `${PlayerType}`
  source: `${Source}`
  effects?: any
  imageElement?: ReactElement<any>
  size?: string
  type?: string
  subtype?: string
  alignment?: string
  description?: string
}

const DefaultArmorClass = {
  type: 'natural',
  value: 10
} as ArmorClass

class Character extends ValueObject {
  private _id
  private _name = ''
  private _init
  private _armor_classes
  private _hit_points
  private _temporary_hit_points
  private _damage
  private _regeneration
  private _conditions
  private _condition_immunities
  private _damage_immunities
  private _damage_resistances
  private _damage_vulnerabilities

  private _strength
  private _dexterity
  private _constitution
  private _intelligence
  private _wisdom
  private _charisma

  private _skills
  private _saving_throws
  private _senses
  private _speed
  private _special_abilities
  private _languages
  private _proficiency_bonus
  private _challenge_rating
  private _xp
  private _actions
  private _reactions
  private _player_type
  private _source
  private _effects

  // monster stats input
  private _imageElement
  private _size
  private _type
  private _subtype
  private _alignment
  private _description

  constructor(character: ICharacter) {
    const {
      id,
      name = '',
      init = 10,
      armor_classes = [DefaultArmorClass],
      hit_points = 10,
      temporary_hit_points = 0,
      damage = 0,
      regeneration = 0,
      conditions = [],
      condition_immunities = [],
      damage_immunities = [],
      damage_resistances = [],
      damage_vulnerabilities = [],
      skills = [],
      saving_throws = [],
      special_abilities = [],

      languages = '',
      proficiency_bonus = 0,
      challenge_rating = 0,
      xp = 0,
      actions = [],
      reactions = [],
      player_type = PlayerType.Enemy,
      source = Source.FifthESRD,
      effects = {},

      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
      speed,
      senses,

      imageElement = null,
      size = '',
      type = '',
      subtype = '',
      alignment = '',
      description = '',
      desc
    } = character
    super()
    this._id = character.index || (id ? id : this.convertNameToId(name))
    this._name = name
    this._init = init
    this._armor_classes = armor_classes
    this._hit_points = hit_points
    this._temporary_hit_points = temporary_hit_points
    this._damage = Math.abs(damage) // turn damage always into positive integer
    this._regeneration = regeneration
    this._conditions = conditions
    this._condition_immunities = condition_immunities
    this._damage_immunities = Character.parseActualDamageTypes(damage_immunities)
    this._damage_resistances = Character.parseActualDamageTypes(damage_resistances)
    this._damage_vulnerabilities = Character.parseActualDamageTypes(damage_vulnerabilities)
    this._skills = _.isEmpty(skills) ? FifthESRDService.parseSkills(character.proficiencies) : skills
    this._saving_throws = _.isEmpty(saving_throws) ? FifthESRDService.parseSavingThrows(character.proficiencies) : saving_throws
    this._senses = senses
    this._special_abilities = special_abilities
    this._languages = languages
    this._proficiency_bonus = proficiency_bonus
    this._challenge_rating = challenge_rating
    this._xp = xp
    this._actions = actions
    this._reactions = reactions
    this._player_type = player_type
    this._source = source
    this._effects = effects

    this._strength = strength
    this._dexterity = dexterity
    this._constitution = constitution
    this._intelligence = intelligence
    this._wisdom = wisdom
    this._charisma = charisma

    this._speed = speed

    this._imageElement = imageElement
    this._size = size
    this._type = type
    this._subtype = subtype
    this._alignment = alignment
    this._description = description || desc
  }

  private getArmorClassesFromConditions(conditions: Condition[]) {
    return conditions.reduce((acsFromConditions, condition) => {
      const conditionEffect = ConditionEffects[condition]
      if (conditionEffect && conditionEffect.AC) {
        // todo, currently ConditionEffects are all spells, add ability to change AC with an actual condition
        acsFromConditions.push({ type: 'spell', value: conditionEffect.AC, spell: { index: condition.replace(' ', '-').toLowerCase(), name: condition } })
      }
      return acsFromConditions
    }, [] as ICharacter['armor_classes'])
  }

  public clone(attributes?: Partial<ICharacter>) {
    const id = attributes?.name ? this.convertNameToId(attributes.name || '') : this.convertNameToId(this.name || '')
    if (attributes) {
      const cloneAttrs = {
        ...this.toJSON(),
        ...attributes,
        id
      }
      return new Character(cloneAttrs)
    } else {
      return new Character(this.toJSON())
    }
  }

  public get id() {
    return this._id
  }

  private convertNameToId = (name: string) => {
    const nameAsId = name.toLowerCase().replaceAll(' ', '-')
    return nameAsId ? nameAsId : uuid()
  }

  public get name() {
    return this._name
  }
  public set name(value) {
    this._name = value
  }

  public get armor_classes(): ICharacter['armor_classes'] {
    return this._armor_classes
  }

  public get armor_class_with_conditions(): ICharacter['armor_classes'] {
    const highestArmorClass = _.maxBy(this._armor_classes, 'value')
    return [...this.getArmorClassesFromConditions(this.conditions)].concat(highestArmorClass ? [highestArmorClass] : [])
  }
  public get armor_class(): number {
    return _.maxBy(this._armor_classes, 'value')?.value || 0
  }
  public get armor_class_total(): number {
    let acSum = 0
    this.armor_class_with_conditions.forEach((ac) => {
      acSum += typeof ac.value === 'number' ? ac.value : 0
    })
    return acSum
  }
  public get armor_class_label(): string {
    const baseArmorClass = _.maxBy(this.armor_classes, 'value') || _.get(this.armor_classes, 0) || [DefaultArmorClass]
    return this.parseArmorClassLabel(baseArmorClass)
  }
  public get armor_class_label_with_conditions(): string {
    const baseArmorClass = _.maxBy(this.armor_class_with_conditions, 'value') || _.get(this.armor_classes, 0) || [DefaultArmorClass]
    const armorClassesWithoutBase = _.without(this.armor_class_with_conditions, baseArmorClass)

    return `${this.parseArmorClassLabel(baseArmorClass)} ${
      armorClassesWithoutBase.length > 0 ? armorClassesWithoutBase.reduce((sum, current) => (sum += ' ' + this.parseArmorClassLabelWithSign(current)), '') : ''
    }`
  }

  public static getArmorClassDetailPath = (armorClass: ArmorClass) => {
    switch (armorClass.type) {
      case 'armor':
        return 'armor.0'
      case 'spell':
        return 'spell'
      case 'condition':
        return 'condition'
      default:
        return ''
    }
  }

  public static getArmorClassNamePath = (armorClass: ArmorClass) => {
    return `${Character.getArmorClassDetailPath(armorClass)}.name`
  }

  public static getArmorClassIndexPath = (armorClass: ArmorClass) => {
    return `${Character.getArmorClassDetailPath(armorClass)}.index`
  }

  public static getArmorClassName = (armorClass: ArmorClass) => {
    return armorClass.type === 'natural' ? 'Natural' : _.get(armorClass, Character.getArmorClassNamePath(armorClass))
  }

  private parseArmorClassLabel = (armorClass: ArmorClass): string => {
    let armorClassLabel = String(armorClass.value)
    if (Character.getArmorClassName(armorClass)) {
      armorClassLabel += ` (${this.parseArmorClassName(Character.getArmorClassName(armorClass))})`
    }
    return armorClassLabel
  }

  private parseArmorClassLabelWithSign = (armorClass: ArmorClass): string => {
    let armorClassLabel = getNumberWithSign(armorClass.value)
    if (Character.getArmorClassName(armorClass)) {
      armorClassLabel += ` (${this.parseArmorClassName(Character.getArmorClassName(armorClass))})`
    }
    return armorClassLabel
  }

  private parseArmorClassName = (name: string) => {
    // changes _ to empty space and capitalizes first letter of every word
    return name
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => capitalize(word))
      .join(' ')
  }

  public set armor_classes(newArmorClasses: ArmorClass[]) {
    this._armor_classes = !_.isEmpty(newArmorClasses) ? newArmorClasses : [DefaultArmorClass]
  }

  public updateArmorClasses = (newArmorClasses: ArmorClass[]) => {
    const uniquenewArmorClasses = _.uniqWith(newArmorClasses, (a, b) => JSON.stringify(a) === JSON.stringify(b))
    if (!_.isEqual(uniquenewArmorClasses, newArmorClasses)) {
      console.warn('trying to set an armor class type TWICE, why u do dis?')
    }
    newArmorClasses.forEach((newArmorClass) => {
      switch (newArmorClass.type) {
        case 'armor':
        case 'spell':
        case 'condition':
        case 'dex':
        case 'natural':
          this._armor_classes = upsertToArray<ArmorClass>(this._armor_classes, newArmorClass as ArmorClass, newArmorClass.type as keyof ArmorClass)
          break
        default:
          this._armor_classes = upsertToArray<ArmorClass>(
            this._armor_classes,
            { type: ArmorClassType.NATURAL, value: newArmorClass.value },
            newArmorClass.type as keyof ArmorClass
          )
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
  public get conditions_label() {
    return getPrintableConditions(this.conditions).join(', ')
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

  public get condition_immunities() {
    return this._condition_immunities
  }
  public get condition_immunities_label() {
    return getPrintableConditions(this.condition_immunities.map((immunity) => immunity.name) as Condition[]).join(', ')
  }
  public set condition_immunities(value) {
    this._condition_immunities = value
  }

  public get damage_immunities() {
    return this._damage_immunities
  }
  public get damage_immunities_label() {
    return this.damage_immunities.join(', ')
  }
  public set damage_immunities(newDamageImmunities) {
    this._damage_immunities = Character.parseActualDamageTypes(newDamageImmunities)
  }

  public get damage_resistances() {
    return this._damage_resistances
  }
  public get damage_resistances_label() {
    return this.damage_resistances.join(', ')
  }
  public set damage_resistances(newDamageResistances) {
    this._damage_resistances = Character.parseActualDamageTypes(newDamageResistances)
  }

  public get damage_vulnerabilities() {
    return this._damage_vulnerabilities
  }
  public get damage_vulnerabilities_label() {
    return this.damage_vulnerabilities.join(', ')
  }
  public set damage_vulnerabilities(newDamageVulnerabilities) {
    this._damage_vulnerabilities = Character.parseActualDamageTypes(newDamageVulnerabilities)
  }

  public static parseActualDamageTypes(damageTypes: DamageType[]) {
    if (_.isEmpty(damageTypes)) {
      return []
    }
    const test = damageTypes.reduce((allDamageTypes, damageType) => {
      const _damageTypes = Character.parseDamageTypeString(damageType)
      return allDamageTypes.concat(_damageTypes)
    }, [] as DamageType[])
    return test
  }

  public static parseDamageTypeString(damageTypeString: DamageType): DamageType[] {
    //console.log('parsing string', damageTypeString)
    const parsedTypes = []
    if (Object.values(DamageType).includes(damageTypeString.toLowerCase() as DamageType)) {
      parsedTypes.push(damageTypeString)
    }
    if (
      damageTypeString.toLowerCase().includes('bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons') ||
      damageTypeString.toLowerCase().includes("bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered") ||
      damageTypeString.toLowerCase().includes('bludgeoning, piercing, and slashing from nonmagical/nonsilver weapons')
    ) {
      parsedTypes.push(DamageType.Not_Silvered)
    }
    if (damageTypeString.toLowerCase().includes('nonmagical bludgeoning, piercing, and slashing')) {
      parsedTypes.push(DamageType.Not_Magical)
    }
    return parsedTypes
  }

  public get player_type() {
    return this._player_type
  }
  public set player_type(value) {
    this._player_type = value
  }

  public get source() {
    return this._source
  }
  public set source(value) {
    this._source = value
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
  public get speed_label() {
    return Object.entries(this.speed || '')
      .map(([key, value]) => `${key !== 'walk' ? key : ''} ${value}`)
      .join(', ')
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

  public get abilityScores() {
    return {
      ...(this.strength ? { strength: this.strength } : {}),
      ...(this.dexterity ? { dexterity: this.dexterity } : {}),
      ...(this.constitution ? { constitution: this.constitution } : {}),
      ...(this.intelligence ? { intelligence: this.intelligence } : {}),
      ...(this.wisdom ? { wisdom: this.wisdom } : {}),
      ...(this.charisma ? { charisma: this.charisma } : {})
    }
  }

  // TODO, make this a setter?
  public set abilityScores(newAbilityScores) {}

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
    // palauta tässä reducen tulos?
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
    return Object.entries(this._senses || '')
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

  public get reactions() {
    return this._reactions
  }
  public set reactions(value) {
    this._reactions = value
  }

  public get special_abilities() {
    return this._special_abilities.map((specialAbility) => {
      return {
        ...specialAbility,
        name: specialAbility.usage ? `${specialAbility.name} (${specialAbility.usage.times} ${specialAbility.usage.type})` : specialAbility.name
      }
    })
  }
  public set special_abilities(value) {
    this._special_abilities = value
  }

  public get imageElement() {
    return this._imageElement
  }
  public set imageElement(value) {
    this._imageElement = value
  }

  public get description() {
    return this._description
  }
  public set description(value) {
    this._description = value
  }

  public get size() {
    return this._size
  }
  public set size(value) {
    this._size = value
  }

  public get type() {
    return this._type
  }
  public set type(value) {
    this._type = value
  }

  public get subtype() {
    return this._subtype
  }
  public set subtype(value) {
    this._subtype = value
  }

  public get alignment() {
    return this._alignment
  }
  public set alignment(value) {
    this._alignment = value
  }

  public get short_description() {
    return `${this.size} ${this.type}${this.subtype ? ` (${this.subtype})` : ''}${this.alignment ? `, ${this.alignment}` : ''}`
  }

  public isUnconscious = () => {
    return this.current_hit_points <= 0
  }

  public isBloodied = () => {
    return this.current_hit_points + this.temporary_hit_points < this.hit_points / 2
  }

  public isEqual(character?: Character): boolean {
    if (!character) {
      return false
    }

    /*
    console.log('this', _.omit(this.toJSON(), ['imageElement']))
    console.log('other', _.omit(character.toJSON(), ['imageElement']))
    console.log('this JSON', JSON.stringify(_.omit(this.toJSON(), ['imageElement'])))
    console.log('other JSON', JSON.stringify(_.omit(character.toJSON(), ['imageElement'])))
    console.log(`equality ${this.name}`, _.isEqual(this.toString(), character.toString()))
    console.log(`equality with images ${this.name}`, _.isEqual(this.toJSON(), character.toJSON()))
    console.log('TO JSON', this.toJSON())
    console.log('diff', new Differ().diff(_.omit(this.toJSON, ['imageElement']), _.omit(character.toJSON(), ['imageElement'])))
    console.log('\n\n')*/

    return _.isEqual(_.omit(this.toJSON(), ['imageElement']), _.omit(character.toJSON(), ['imageElement']))
  }

  public toJSON(): ICharacter {
    return Object.keys(this).reduce((a, b) => {
      if (typeof this[b as keyof this] !== 'function') {
        a[b.replace('_', '')] = this[b as keyof this]
      }
      return a
    }, {} as { [key: string]: any }) as ICharacter
  }

  public static fromJSON(character: { [key: string]: any }) {
    character.damage = Math.abs(character.damage) // turn damage always into positive integer

    return new Character(character as ICharacter)
  }

  public toString(): string {
    return JSON.stringify(this)
  }
}

export default Character
