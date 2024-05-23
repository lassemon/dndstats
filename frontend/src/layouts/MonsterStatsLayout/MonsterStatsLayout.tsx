import MonsterStats from 'components/MonsterStats'
import MonsterStatsInput from 'components/MonsterStatsInput'
import StatsLayout from 'layouts/StatsLayout'
import React, { useState } from 'react'

const MonsterStatsLayout: React.FC = () => {
  const [screenshotMode, setScreenshotMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  return (
    <StatsLayout
      screenshotMode={screenshotMode}
      alwaysPortrait={true}
      statsComponent={<MonsterStats screenshotMode={screenshotMode} editMode={editMode} setEditMode={setEditMode} />}
      inputComponent={
        <MonsterStatsInput
          screenshotMode={screenshotMode}
          setScreenshotMode={setScreenshotMode}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      }
    />
  )
}

export default MonsterStatsLayout
