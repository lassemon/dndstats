import { ItemDTO } from '@dmtool/application'
import ItemCard from 'components/ItemCard'
import WeaponStats from 'components/WeaponStats'
import WeaponStatsInput from 'components/WeaponStatsInput'
import { weaponAtom } from 'infrastructure/dataAccess/atoms'
import { useAtom } from 'jotai'
import StatsLayout from 'layouts/StatsLayout'
import React, { useMemo, useState } from 'react'

const WeaponStatsLayout: React.FC = () => {
  const [screenshotMode, setScreenshotMode] = useState(false)
  const [currentWeapon] = useAtom(useMemo(() => weaponAtom, []))

  if (!currentWeapon) {
    return null
  }

  return (
    <StatsLayout
      screenshotMode={screenshotMode}
      statsComponent={
        <>
          <WeaponStats screenshotMode={screenshotMode} />
          <ItemCard item={new ItemDTO(currentWeapon)} />
        </>
      }
      inputComponent={<WeaponStatsInput screenshotMode={screenshotMode} setScreenshotMode={setScreenshotMode} />}
    />
  )
}

export default WeaponStatsLayout
