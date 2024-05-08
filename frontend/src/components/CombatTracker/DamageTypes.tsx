import React from 'react'
import { DamageSource } from 'interfaces'
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

const Icons: { [key in DamageSource]?: string } = {
  [DamageSource.Slashing]: Slashing,
  [DamageSource.Piercing]: Piercing,
  [DamageSource.Bludgeoning]: Bludgeoning,
  [DamageSource.Poison]: Poison,
  [DamageSource.Acid]: Acid,
  [DamageSource.Fire]: Fire,
  [DamageSource.Elemental]: Elemental,
  [DamageSource.Silver]: Silver,
  [DamageSource.Adamantine]: Adamantine,
  [DamageSource.All_Physical]: Physical,
  [DamageSource.All_Magical]: Magical,
  [DamageSource.Cold]: Cold,
  [DamageSource.Radiant]: Radiant,
  [DamageSource.Necrotic]: Necrotic,
  [DamageSource.Lightning]: Lightning,
  [DamageSource.Thunder]: Thunder,
  [DamageSource.Force]: Force,
  [DamageSource.Psychic]: Psychic,
  [DamageSource.From_Spells]: Magical,
  [DamageSource.Not_Silvered]: Bludgeoning_Piercing_Slashing,
  [DamageSource.Not_Adamantine]: Bludgeoning_Piercing_Slashing,
  [DamageSource.Not_Magical]: Bludgeoning_Piercing_Slashing
}

export const DamageTypeToIconMap = Object.values(DamageSource).reduce((accumulator, key) => {
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
}, {} as { [key in DamageSource]: JSX.Element })
