import SpellStats from 'components/SpellStats'
import SpellStatsInput from 'components/SpellStatsInput'
import StatsLayout from 'layouts/StatsLayout'
import React, { useState } from 'react'

const SpellStatsLayout: React.FC = () => {
  const [screenshotMode, setScreenshotMode] = useState(false)
  return (
    <StatsLayout
      screenshotMode={screenshotMode}
      defaultWidth="65%"
      statsComponent={<SpellStats screenshotMode={screenshotMode} />}
      inputComponent={<SpellStatsInput screenshotMode={screenshotMode} setScreenshotMode={setScreenshotMode} />}
    />
  )
}

export default SpellStatsLayout
