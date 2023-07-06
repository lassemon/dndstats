import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { Typography } from '@material-ui/core'

import Bloodied from 'assets/Bloodied.png'
import Blinded from 'assets/Blinded.png'
import Blessed from 'assets/Blessed.png'
import Baned from 'assets/Baned.png'
import Dead from 'assets/Dead.png'
import Unconscious from 'assets/Unconcious.png'
import Restrained from 'assets/Restrained.png'
import Charmed from 'assets/Charmed.png'
import Grappled from 'assets/Grappled.png'
import Invisible from 'assets/Invisible.png'
import Paralyzed from 'assets/Paralyzed.png'
import Petrified from 'assets/Petrified.png'
import Stunned from 'assets/Stunned.png'
import Prone from 'assets/Prone.png'
import Stabilized from 'assets/Stabilized.png'
import Shield_of_Faith from 'assets/Shield_of_Faith.png'
import Reaction_Used from 'assets/Reaction_Used.png'
import Posessed from 'assets/Posessed.png'
import MageArmor from 'assets/MageArmor.png'
import Incapacitated from 'assets/Incapacitated.png'
import Holding_Action from 'assets/Holding_Action.png'
import Hex from 'assets/Hex.png'
import Hasted from 'assets/Hasted.png'
import Frightened from 'assets/Frightened.png'
import Deafened from 'assets/Deafened.png'
import Concentration from 'assets/Concentration.png'
import Poisoned from 'assets/Poisoned.png'

import { Condition } from 'interfaces'

const Icons: { [key in Condition]?: string } = {
  [Condition.Bloodied]: Bloodied,
  [Condition.Baned]: Baned,
  [Condition.Blessed]: Blessed,
  [Condition.Blinded]: Blinded,
  [Condition.Charmed]: Charmed,
  [Condition.Concentration]: Concentration,
  [Condition.Dead]: Dead,
  [Condition.Deafened]: Deafened,
  [Condition.Frightened]: Frightened,
  [Condition.Grappled]: Grappled,
  [Condition.Holding_Action]: Holding_Action,
  [Condition.Hex]: Hex,
  [Condition.Hasted]: Hasted,
  [Condition.Incapacitated]: Incapacitated,
  [Condition.Invisible]: Invisible,
  [Condition.Mage_Armor]: MageArmor,
  [Condition.Paralyzed]: Paralyzed,
  [Condition.Petrified]: Petrified,
  [Condition.Poisoned]: Poisoned,
  [Condition.Prone]: Prone,
  [Condition.Posessed]: Posessed,
  [Condition.Restrained]: Restrained,
  [Condition.Reaction_Used]: Reaction_Used,
  [Condition.Stunned]: Stunned,
  [Condition.Stabilized]: Stabilized,
  [Condition.Shield_of_Faith]: Shield_of_Faith,
  [Condition.Unconscious]: Unconscious
}

export const ConditionDescription: { [key in Condition]?: string } = {
  [Condition.Bloodied]: 'Half or less HP left',
  [Condition.Dead]: '',
  [Condition.Blinded]: `A blinded creature can’t see and automatically fails any ability check that requires sight.
  Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.`,
  [Condition.Charmed]: `A charmed creature can’t attack the charmer or target the charmer with harmful abilities or magical effects.
  The charmer has advantage on any ability check to interact socially with the creature.`,
  [Condition.Deafened]: 'A deafened creature can’t hear and automatically fails any ability check that requires hearing.',
  [Condition.Frightened]: `A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.
  The creature can’t willingly move closer to the source of its fear.`,
  [Condition.Grappled]: `A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.
  The condition ends if the grappler is incapacitated (see the condition).
  The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect, such as when a creature is hurled away by the thunderwave spell.`,
  [Condition.Incapacitated]: `An incapacitated creature can’t take actions or reactions.`,
  [Condition.Invisible]: `An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured. The creature’s location can be detected by any noise it makes or any tracks it leaves.
  Attack rolls against the creature have disadvantage, and the creature’s attack rolls have advantage.`,
  [Condition.Paralyzed]: `A paralyzed creature is incapacitated (see the condition) and can’t move or speak.
  The creature automatically fails Strength and Dexterity saving throws.
  Attack rolls against the creature have advantage.
  Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.`,
  [Condition.Petrified]: `A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.
  The creature is incapacitated (see the condition), can’t move or speak, and is unaware of its surroundings.
  Attack rolls against the creature have advantage.
  The creature automatically fails Strength and Dexterity saving throws.
  The creature has resistance to all damage.
  The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.`,
  [Condition.Poisoned]: `A poisoned creature has disadvantage on attack rolls and ability checks.`,
  [Condition.Prone]: `A prone creature’s only movement option is to crawl, unless it stands up and thereby ends the condition.
  The creature has disadvantage on attack rolls.
  An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.`,
  [Condition.Restrained]: `A restrained creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.
  Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.
  The creature has disadvantage on Dexterity saving throws.`,
  [Condition.Stunned]: `A stunned creature is incapacitated (see the condition), can’t move, and can speak only falteringly.
  The creature automatically fails Strength and Dexterity saving throws.
  Attack rolls against the creature have advantage.`,
  [Condition.Unconscious]: `An unconscious creature is incapacitated (see the condition), can’t move or speak, and is unaware of its surroundings
  The creature drops whatever it’s holding and falls prone.
  The creature automatically fails Strength and Dexterity saving throws.
  Attack rolls against the creature have advantage.
  Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.`,
  [Condition.Stabilized]: `A stable creature doesn’t make death saving throws, even though it has 0 hit points, but it does remain unconscious. The creature stops being stable, and must start making death saving throws again, if it takes any damage. A stable creature that isn’t healed regains 1 hit point after 1d4 hours.`,
  [Condition.Shield_of_Faith]: `+2 bonus to AC for the duration`,
  [Condition.Reaction_Used]: 'No reaction on this round',
  [Condition.Posessed]: ``,
  [Condition.Mage_Armor]: `Target's base AC becomes 13 + its Dexterity modifier`,
  [Condition.Holding_Action]: '',
  [Condition.Hex]: `Caster of the Hex deals an extra 1d6 necrotic damage to the target whenever they hit it with an attack. Also, The target has disadvantage on one chosen ability checks.`,
  [Condition.Hasted]: `Speed is doubled, +2 bonus to AC, advantage on Dexterity saving throws, an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.`,
  [Condition.Concentration]: `Whenever you take damage while you are concentrating on a spell, you must make a Constitution saving throw to maintain your concentration. The DC equals half the damage you take (minimum of 10). If you take damage from multiple sources, such as an arrow and a dragon’s breath, you make a separate saving throw for each source of damage.`,
  [Condition.Blessed]: `Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.`,
  [Condition.Baned]: `Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.`
}

export const ConditionToIconMap = Object.values(Condition).reduce((accumulator, key) => {
  accumulator[key] = (
    <Tooltip
      title={
        <React.Fragment>
          <Typography variant="h6">{(key[0].toUpperCase() + key.slice(1)).replaceAll('_', ' ')}</Typography>
          <Typography variant="body2">{ConditionDescription[key]}</Typography>
        </React.Fragment>
      }
      placement="top"
    >
      <span className="MuiIcon-root">
        <img alt={key[0].toUpperCase() + key.slice(1)} src={Icons[key]} width="30px" />
      </span>
    </Tooltip>
  )
  return accumulator
}, {} as { [key in Condition]: JSX.Element })
