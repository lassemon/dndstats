import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { Typography } from '@mui/material'

import Baned from 'assets/Baned.png'
import Blessed from 'assets/Blessed.png'
import InspiredByBard from 'assets/BlessedByBard.png'
import Blinded from 'assets/Blinded.png'
import Bloodied from 'assets/Bloodied.png'
import Burning from 'assets/Burning.png'
import Blur from 'assets/Blur.png'
import Charmed from 'assets/Charmed.png'
import Concentration from 'assets/Concentration.png'
import Confused from 'assets/Confused.png'
import Dead from 'assets/Dead.png'
import Deafened from 'assets/Deafened.png'
import Diseased from 'assets/Diseased.png'
import Exhausted from 'assets/Exhausted.png'
import Frightened from 'assets/Frightened.png'
import Grappled from 'assets/Grappled.png'
import Guidance from 'assets/Guidance.png'
import Hasted from 'assets/Hasted.png'
import HalfCover from 'assets/HalfCover.png'
import Hex from 'assets/Hex.png'
import Hidden from 'assets/Hidden.png'
import Holding_Action from 'assets/Holding_Action.png'
import Incapacitated from 'assets/Incapacitated.png'
import Invisible from 'assets/Invisible.png'
import MageArmor from 'assets/MageArmor.png'
import MirrorImage from 'assets/MirrorImage.png'
import Paralyzed from 'assets/Paralyzed.png'
import Petrified from 'assets/Petrified.png'
import Poisoned from 'assets/Poisoned.png'
import Posessed from 'assets/Posessed.png'
import Prone from 'assets/Prone.png'
import Reaction_Used from 'assets/Reaction_Used.png'
import Restrained from 'assets/Restrained.png'
import Raging from 'assets/Raging.png'
import Shield_of_Faith from 'assets/Shield_of_Faith.png'
import Slowed from 'assets/Slowed.png'
import Stabilized from 'assets/Stabilized.png'
import Stunned from 'assets/Stunned.png'
import ThreeQuartersCover from 'assets/ThreeQuartersCover.png'
import TotalCover from 'assets/TotalCover.png'
import Unconscious from 'assets/Unconcious.png'

import { Condition } from 'interfaces'
import Character from 'domain/entities/Character'
import { APIReference } from 'domain/services/FifthESRDService'
import _ from 'lodash'
import { formatKeyString } from 'utils/utils'

const Icons: { [key in Condition]?: string } = {
  [Condition.Baned]: Baned,
  [Condition.Blessed]: Blessed,
  [Condition.InspiredByBard]: InspiredByBard,
  [Condition.Blinded]: Blinded,
  [Condition.Bloodied]: Bloodied,
  [Condition.Blur]: Blur,
  [Condition.Burning]: Burning,
  [Condition.Charmed]: Charmed,
  [Condition.Concentration]: Concentration,
  [Condition.Confused]: Confused,
  [Condition.Dead]: Dead,
  [Condition.Deafened]: Deafened,
  [Condition.Diseased]: Diseased,
  [Condition.Exhaustion]: Exhausted,
  [Condition.Frightened]: Frightened,
  [Condition.Grappled]: Grappled,
  [Condition.Guidance]: Guidance,
  [Condition.Hasted]: Hasted,
  [Condition.HalfCover]: HalfCover,
  [Condition.Hex]: Hex,
  [Condition.Hidden]: Hidden,
  [Condition.Holding_Action]: Holding_Action,
  [Condition.Incapacitated]: Incapacitated,
  [Condition.Invisible]: Invisible,
  [Condition.Mage_Armor]: MageArmor,
  [Condition.MirrorImage]: MirrorImage,
  [Condition.Paralyzed]: Paralyzed,
  [Condition.Petrified]: Petrified,
  [Condition.Poisoned]: Poisoned,
  [Condition.Posessed]: Posessed,
  [Condition.Prone]: Prone,
  [Condition.Raging]: Raging,
  [Condition.Reaction_Used]: Reaction_Used,
  [Condition.Restrained]: Restrained,
  [Condition.Shield_of_Faith]: Shield_of_Faith,
  [Condition.Slowed]: Slowed,
  [Condition.Stabilized]: Stabilized,
  [Condition.Stunned]: Stunned,
  [Condition.ThreeQuartersCover]: ThreeQuartersCover,
  [Condition.TotalCover]: TotalCover,
  [Condition.Unconscious]: Unconscious
}

export const ConditionDescription: { [key in Condition]?: string } = {
  [Condition.Bloodied]: 'Half or less HP left',
  [Condition.Dead]: ``,
  [Condition.Burning]: `Until a creature takes an action to douse the fire, the target takes 5 (1d10) fire damage at the start of each of its turns.`,
  [Condition.Blur]: `For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.`,
  [Condition.Confused]: `An affected target can't take reactions and must roll a <b>d10</b> at the start of each of its turns to determine its behavior for that turn.
<b>1:</b> The creature uses all its movement to move in a random direction. To determine the direction, roll a d8 and assign a direction to each die face. The creature doesn't take an action this turn.
<b>2-6:</b> The creature doesn't move or take actions this turn.
<b>7-8:</b> The creature uses its action to make a melee attack against a randomly determined creature within its reach. If there is no creature within its reach, the creature does nothing this turn.
<b>9-10:</b> The creature can act and move normally.
At the end of its turns, an affected target can make a Wisdom saving throw. If it succeeds, this effect ends for that target.`,
  [Condition.Exhaustion]: `Level	Effect
<b>1</b>	Disadvantage on ability checks
<b>2</b>	Speed halved
<b>3</b>	Disadvantage on attack rolls and saving throws
<b>4</b>	Hit point maximum halved
<b>5</b>	Speed reduced to 0
<b>6</b>	Death`,
  [Condition.Holding_Action]: `Define a trigger that uses your action. Using your held action expends you reaction.
Holding a spell requires Concentration until the trigger.`,
  [Condition.MirrorImage]: `If you have three duplicates, you must roll a 6 or higher to change the attack's target to a duplicate. With two duplicates, you must roll an 8 or higher. With one duplicate, you must roll an 11 or higher.
A duplicate's AC equals 10 + your Dexterity modifier. If an attack hits a duplicate, the duplicate is destroyed.`,
  [Condition.Raging]: `Rage is a barbarian class exclusive trait.

On your turn, you can enter a rage as a <b>bonus action</b>.
While raging, you gain the following benefits if you aren’t wearing heavy armor:

&#9679; You have advantage on Strength checks and Strength saving throws.
&#9679; When you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian, as shown in the Rage Damage column of the Barbarian table.
&#9679; You have resistance to bludgeoning, piercing, and slashing damage.

If you are able to cast spells, you can’t cast them or concentrate on them while raging.

Your rage lasts for <b>1 minute</b>. It ends early if you are knocked <b>unconscious</b> or if your turn ends and you haven’t attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.

Once you have raged the number of times shown for your barbarian level in the Rages column of the Barbarian table, you must finish a long rest before you can rage again.`,
  [Condition.Slowed]: `Target's speed is halved, it takes a -2 penalty to AC and Dexterity saving throws, and it can't use reactions. On its turn, it can use either an action or a bonus action, not both.
Regardless of the creature's abilities or magic items, it can't make more than one melee or ranged attack during its turn.
If the creature attempts to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn't take effect until the creature's next turn, and the creature must use its action on that turn to complete the spell. If it can't, the spell is wasted.
Repeat the Wisdom saving throw at the end of each of its turns.`,
  [Condition.Blinded]: `A blinded creature can’t see and automatically fails any ability check that requires sight.
Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.`,
  [Condition.Charmed]: `A charmed creature can’t attack the charmer or target the charmer with harmful abilities or magical effects.
The charmer has advantage on any ability check to interact socially with the creature.`,
  [Condition.Deafened]: 'A deafened creature can’t hear and automatically fails any ability check that requires hearing.',
  [Condition.Diseased]:
    'A disease can have varying effect depending on the source. This character might be able to repeat a saving throw to get rid of the disease during or at the end of their turn.',
  [Condition.Frightened]: `A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.
The creature can’t willingly move closer to the source of its fear.`,
  [Condition.Grappled]: `A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.
The condition ends if the grappler is incapacitated (see the condition).
The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect, such as when a creature is hurled away by the thunderwave spell.`,
  [Condition.Guidance]: `Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice.
It can roll the die before or after making the ability check. The spell then ends.`,
  [Condition.Incapacitated]: `An incapacitated creature can’t take actions or reactions.`,
  [Condition.InspiredByBard]: `Once within the next 10 minutes, the creature can roll the bardic inspiration die and add the number rolled to one ability check, attack roll, or saving throw it makes.
The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails.
Once the Bardic Inspiration die is rolled, it is lost.A creature can have only one Bardic Inspiration die at a time.`,
  [Condition.Invisible]: `An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured.
The creature’s location can be detected by any noise it makes or any tracks it leaves.
Attack rolls against the creature have disadvantage, and the creature’s attack rolls have advantage.`,
  [Condition.Paralyzed]: `A paralyzed creature is incapacitated (see the condition) and can’t move or speak.
The creature automatically fails Strength and Dexterity saving throws.
Attack rolls against the creature have advantage.
Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.`,
  [Condition.Petrified]: `A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone).
Its weight increases by a factor of ten, and it ceases aging.
The creature is incapacitated (see the condition), can’t move or speak, and is unaware of its surroundings.
Attack rolls against the creature have advantage.
The creature automatically fails Strength and Dexterity saving throws.
The creature has resistance to all damage.
The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.`,
  [Condition.Poisoned]: `A poisoned creature has disadvantage on attack rolls and ability checks.`,
  [Condition.Posessed]: `Multiple creatures in DnD have the ability to posess other creatures.
Usually this involves a charisma or a wisdom saving throw and incapacitating and taking control over the posessed target.
Specific mechanics are usually listed in the creatures ability description.`,
  [Condition.Prone]: `A prone creature’s only movement option is to crawl, unless it stands up and thereby ends the condition.
The creature has disadvantage on attack rolls.
An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.`,
  [Condition.Restrained]: `A restrained creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.
Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.
The creature has disadvantage on Dexterity saving throws.`,
  [Condition.Stunned]: `A stunned creature is incapacitated (see the condition), can’t move, and can speak only falteringly.
The creature automatically fails Strength and Dexterity saving throws.
Attack rolls against the creature have advantage.`,
  [Condition.Unconscious]: `An unconscious creature is incapacitated (see the condition), can’t move or speak, and is unaware of its surroundings.
The creature drops whatever it’s holding and falls prone.
The creature automatically fails Strength and Dexterity saving throws.
Attack rolls against the creature have advantage.
Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.`,
  [Condition.Stabilized]: `A stable creature doesn’t make death saving throws, even though it has 0 hit points, but it does remain unconscious.
The creature stops being stable, and must start making death saving throws again, if it takes any damage.
A stable creature that isn’t healed regains 1 hit point after 1d4 hours.`,
  [Condition.Shield_of_Faith]: `+2 bonus to AC for the duration`,
  [Condition.Reaction_Used]: 'No reaction on this round',
  [Condition.Mage_Armor]: `Target's base AC becomes 13 + its Dexterity modifier`,
  [Condition.HalfCover]: `A target with half cover has a +2 bonus to AC and Dexterity saving throws. A target has half cover if an obstacle blocks at least half of its body.
The obstacle might be a low wall, a large piece of furniture, a narrow tree trunk, or a creature, whether that creature is an enemy or a friend.`,
  [Condition.ThreeQuartersCover]: `A target with three-quarters cover has a +5 bonus to AC and Dexterity saving throws. A target has three-quarters cover if about three-quarters of it is covered by an obstacle.
The obstacle might be a portcullis, an arrow slit, or a thick tree trunk.`,
  [Condition.TotalCover]: `A target with total cover can't be targeted directly by an attack or a spell, although some spells can reach such a target by including it in an area of effect.
A target has total cover if it is completely concealed by an obstacle.`,
  [Condition.Hex]: `Caster of the Hex deals an extra 1d6 necrotic damage to the target whenever they hit it with an attack.
Also, The target has disadvantage on one chosen ability checks.`,
  [Condition.Hidden]: `When you attack a target that you can't see, you have disadvantage on the attack roll.
When a creature can't see you, you have advantage on attack rolls against it. If you are hidden--both unseen and unheard--when you make an attack, you give away your location when the attack hits or misses.`,
  [Condition.Hasted]: `Speed is doubled, +2 bonus to AC, advantage on Dexterity saving throws, an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.`,
  [Condition.Concentration]: `Whenever you take damage while you are concentrating on a spell, you must make a Constitution saving throw to maintain your concentration. The DC equals half the damage you take (minimum of 10).
If you take damage from multiple sources, such as an arrow and a dragon’s breath, you make a separate saving throw for each source of damage.`,
  [Condition.Blessed]: `Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.`,
  [Condition.Baned]: `Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.`
}

export const ConditionEffects = {
  [Condition.Slowed]: {
    AC: -2
  },
  [Condition.Hasted]: {
    AC: 2
  },
  [Condition.Shield_of_Faith]: {
    AC: +2
  },
  [Condition.HalfCover]: {
    AC: +2
  },
  [Condition.ThreeQuartersCover]: {
    AC: +5
  },
  [Condition.Mage_Armor]: {
    AC: '(13 + Dexterity modifier)'
  }
} as { [key in Condition]: any }

export const ConditionToIconMap = Object.values(Condition).reduce((accumulator, key) => {
  accumulator[key] = (
    <Tooltip
      title={
        <>
          <Typography variant="h6">{(key[0].toUpperCase() + key.slice(1)).replaceAll('_', ' ')}</Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap'
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: ConditionDescription[key] || '' }} />
          </Typography>
        </>
      }
      placement="top-start"
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            maxWidth: '450px'
          }
        }
      }}
    >
      <span
        style={{
          width: '1.5em',
          height: '1.5em',
          padding: '0 0.7em 0.7em 0',
          display: 'flex',
          textAlign: 'center',
          lineHeight: '1.8em',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <img alt={key[0].toUpperCase() + key.slice(1)} src={Icons[key]} height="35px" />
        <span
          style={{
            fontSize: '0.4em',
            fontWeight: '600',
            position: 'absolute',
            transform: 'translateY(-45%)',
            color: 'black',
            zIndex: '2',
            bottom: 0,
            lineHeight: '1.2em',
            width: '5em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: `0px 0px 2px #c77b09`
          }}
        >
          {formatKeyString(key)}
        </span>
      </span>
    </Tooltip>
  )
  return accumulator
}, {} as { [key in Condition]: JSX.Element })

export const getConditionEffects = (conditions: Condition[]) => {
  const effects: any = {}
  conditions.forEach((key) => {
    const effectObject = ConditionEffects[key]
    for (const key in effectObject) {
      if (!effects[key]) {
        effects[key] = effectObject[key]
      } else {
        effects[key] = `${effects[key]}${effectObject[key]}`
      }
    }
  })

  return effects
}

export const getPrintableConditions = (conditions: Condition[]) => {
  return conditions.map((condition) => condition.replaceAll('_', ' '))
}

export const calculateEffect = (value: string, character: Character) => {
  if (Object.keys(character.effects).includes(value)) {
    return parseEffectString(`${character[value as keyof Character]}${character.effects[value]}`)
  } else {
    return character[value as keyof Character]
  }
}

export const calculateEffectTooltip = (value: string, character: Character) => {
  if (Object.keys(character.effects).includes(value)) {
    if (character.conditions.includes(Condition.Mage_Armor)) {
      return ConditionEffects[Condition.Mage_Armor][value]
    }
    return `${character[value as keyof Character]} ${character.effects[value]}`
  } else {
    return character[value as keyof Character]
  }
}

const parseEffectString = (calculation: string) => {
  try {
    return new Function('return ' + calculation)()
  } catch (error: any) {
    return '?'
  }
}

export const conditionToApiReference = (condition: Condition): APIReference => {
  return {
    index: condition.toLowerCase(),
    name: condition
  }
}

export const getConditionImmunitiesList = () => {
  return _.without(
    Object.values(Condition),
    Condition.Dead,
    Condition.Bloodied,
    Condition.Baned,
    Condition.Blessed,
    Condition.Blur,
    Condition.Concentration,
    Condition.Holding_Action,
    Condition.Guidance,
    Condition.InspiredByBard,
    Condition.Hex,
    Condition.Hasted,
    Condition.Mage_Armor,
    Condition.MirrorImage,
    Condition.Reaction_Used,
    Condition.Stabilized,
    Condition.Shield_of_Faith,
    Condition.Raging,
    Condition.Invisible
  )
}
