import WeaponStats from 'components/WeaponStats'
import WeaponStatsInput from 'components/WeaponStatsInput'
import StatsLayout from 'layouts/StatsLayout'
import React, { useState } from 'react'

const WeaponStatsLayout: React.FC = () => {
  const [screenshotMode, setScreenshotMode] = useState(false)

  return (
    <StatsLayout
      screenshotMode={screenshotMode}
      statsComponent={<WeaponStats screenshotMode={screenshotMode} />}
      inputComponent={<WeaponStatsInput screenshotMode={screenshotMode} setScreenshotMode={setScreenshotMode} />}
    />
  )
}

export default WeaponStatsLayout
