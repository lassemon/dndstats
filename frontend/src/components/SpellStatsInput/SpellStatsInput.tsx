import { Grid, TextField } from '@mui/material'
import StatsInputContainer from 'components/StatsInputContainer'
import React from 'react'
import { useRecoilState } from 'recoil'
import { spellState } from 'recoil/atoms'

export const SpellStatsInput: React.FC = () => {
  const [currentSpell, setCurrentSpell] = useRecoilState(spellState)

  const onChange = (name: string) => (event: any) =>
    setCurrentSpell((spell) => {
      return { ...spell, [name]: event.target.value }
    })

  return (
    <StatsInputContainer>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <TextField id="spell-name" label="Name" value={currentSpell.name} onChange={onChange('name')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField id="spell-short-description" label="Short Description" value={currentSpell.shortDescription} onChange={onChange('shortDescription')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField id="spell-casting-time" label="Casting Time" value={currentSpell.castingtime} onChange={onChange('castingtime')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField id="spell-range" label="Range" value={currentSpell.range} onChange={onChange('range')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField id="spell-components" label="Components" value={currentSpell.components} onChange={onChange('components')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField id="spell-duration" label="Duration" value={currentSpell.duration} onChange={onChange('duration')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField id="spell-classes" label="Classes" value={currentSpell.classes} onChange={onChange('classes')} />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField
            id="spell-main-description"
            label="Main Description"
            value={currentSpell.mainDescription}
            multiline={true}
            onChange={onChange('mainDescription')}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField
            id="spell-at-higher-levels"
            label="At higher levels"
            value={currentSpell.athigherlevels}
            multiline={true}
            onChange={onChange('athigherlevels')}
          />
        </Grid>
      </Grid>
    </StatsInputContainer>
  )
}

export default SpellStatsInput
