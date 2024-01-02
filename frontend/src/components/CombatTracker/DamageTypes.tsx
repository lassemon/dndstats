import React from 'react'
import { DamageType } from 'interfaces'
import Slashing from 'assets/damagetypes/Slashing.png'
import Piercing from 'assets/damagetypes/Piercing.png'
import Bludgeoning from 'assets/damagetypes/Bludgeoning.png'
import Bludgeoning_Piercing_Slashing from 'assets/damagetypes/Bludgeoning_Piercing_Slashing.png'
import Poison from 'assets/damagetypes/Poison.png'
import Acid from 'assets/damagetypes/Acid.png'
import Adamantine from 'assets/damagetypes/Adamantine.png'
import Silver from 'assets/damagetypes/Silver.png'
import Fire from 'assets/damagetypes/Fire.png'
import Cold from 'assets/damagetypes/Cold.png'
import Physical from 'assets/damagetypes/Physical.png'
import Magical from 'assets/damagetypes/Magical.png'
import Radiant from 'assets/damagetypes/Radiant.png'
import Necrotic from 'assets/damagetypes/Necrotic.png'
import Elemental from 'assets/damagetypes/Elemental.png'
import Lightning from 'assets/damagetypes/Lightning.png'
import Thunder from 'assets/damagetypes/Thunder.png'
import Force from 'assets/damagetypes/Force.png'
import Psychic from 'assets/damagetypes/Psychic.png'

const Icons: { [key in DamageType]?: string } = {
  [DamageType.Slashing]: Slashing,
  [DamageType.Piercing]: Piercing,
  [DamageType.Bludgeoning]: Bludgeoning,
  [DamageType.Poison]: Poison,
  [DamageType.Acid]: Acid,
  [DamageType.Fire]: Fire,
  [DamageType.Elemental]: Elemental,
  [DamageType.Silver]: Silver,
  [DamageType.Adamantine]: Adamantine,
  [DamageType.All_Physical]: Physical,
  [DamageType.All_Magical]: Magical,
  [DamageType.Cold]: Cold,
  [DamageType.Radiant]: Radiant,
  [DamageType.Necrotic]: Necrotic,
  [DamageType.Lightning]: Lightning,
  [DamageType.Thunder]: Thunder,
  [DamageType.Force]: Force,
  [DamageType.Psychic]: Psychic,
  [DamageType.From_Spells]: Magical,
  [DamageType.Not_Silvered]: Bludgeoning_Piercing_Slashing,
  [DamageType.Not_Adamantine]: Bludgeoning_Piercing_Slashing,
  [DamageType.Not_Magical]: Bludgeoning_Piercing_Slashing
}

export const DamageTypeToIconMap = Object.values(DamageType).reduce((accumulator, key) => {
  accumulator[key] = (
    <span
      style={{
        width: '1em',
        height: '1em',
        display: 'block',
        textAlign: 'center',
        lineHeight: '1em'
      }}
    >
      <img alt={key[0].toUpperCase() + key.slice(1)} src={Icons[key]} />
    </span>
  )
  return accumulator
}, {} as { [key in DamageType]: JSX.Element })
