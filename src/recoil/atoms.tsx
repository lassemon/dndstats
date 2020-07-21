import mjolnirImage from 'assets/mjolnirImage'
import shieldImage from 'assets/shieldImage'
import React from 'react'
import { atom } from 'recoil'

export const weaponState = atom({
  key: "weaponState",
  default: {
    image: React.createElement("img", {
      width: 200,
      alt: "mjolnir",
      src: mjolnirImage,
    }),
    name: "Mjölnir",
    shortDescription:
      "Whoever holds this hammer shall posess the power of Thor.",
    mainDescription: `This hammer has the finesse property.
While attuned to this weapon the hammer deals additional 12 (4d6) thunder damage.`,
    features: [
      {
        featureName: "Weight of the World",
        featureDescription: `While attuned you feel the weight of the world on your shoulders.
At the end of each round throw a constitution save DC 14.
On a failed save you become exhausted (level of 3) for the duration of the next round.`,
      },
    ],
    damage: "2d6 + DEX modifier Bludgeoning damage",
    weight: "2 lb.",
    properties: "Light, finesse, +4d6 thunder damage",
  },
})

export const itemState = atom({
  key: "itemState",
  default: {
    image: React.createElement("img", {
      width: 200,
      alt: "greatshield",
      src: shieldImage,
    }),
    name: "Greatshield of Artorias",
    shortDescription: "Shield, artifact (requires attunement, 18 str)",
    mainDescription:
      "Shield beloning to the great Abysswalker, Knight Artorias. Boast consistent defense and divine protection againts various status effects.",
    features: [
      {
        featureName: "Magic Shield",
        featureDescription:
          "While holding this shield you have a bonus of +2 to AC and gain immunity to poison damage.",
      },
      {
        featureName: "Divine Resistance",
        featureDescription:
          "You are resistant to fire, force and necrotic damage while wielding this shield.",
      },
    ],
  },
})
