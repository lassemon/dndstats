import { Grid, Typography } from '@mui/material'
import { DamageType } from 'interfaces'
import _ from 'lodash'
import React from 'react'

interface StatusModifierProps {
  resistances: DamageType[]
  vulnerabilities: DamageType[]
  immunities: DamageType[]
}

const StatusModifiers: React.FC<StatusModifierProps> = (props) => {
  const { resistances, vulnerabilities, immunities } = props

  return (
    <Grid container={true} columnSpacing={2} rowSpacing={0}>
      {resistances && !_.isEmpty(resistances) && (
        <Grid item={true}>
          <Typography variant="body2">Resistances:</Typography>
          {(resistances || []).map((resistance, resistanceIndex) => {
            return (
              <span key={resistanceIndex} style={{ textTransform: 'capitalize', display: 'block', padding: '0 0 0 4px' }}>
                {resistance}
              </span>
            )
          })}
        </Grid>
      )}
      {vulnerabilities && !_.isEmpty(vulnerabilities) && (
        <Grid item={true}>
          <Typography variant="body2">Vulnerabilities:</Typography>
          {(vulnerabilities || []).map((vulnerability, vulnerabilityIndex) => {
            return (
              <span key={vulnerabilityIndex} style={{ textTransform: 'capitalize', display: 'block', padding: '0 0 0 4px' }}>
                {vulnerability}
              </span>
            )
          })}
        </Grid>
      )}
      {immunities && !_.isEmpty(immunities) && (
        <Grid item={true}>
          <Typography variant="body2">Immunities:</Typography>
          {(immunities || []).map((immunity, immunityIndex) => {
            return (
              <span key={immunityIndex} style={{ textTransform: 'capitalize', display: 'block', padding: '0 0 0 4px' }}>
                {immunity}
              </span>
            )
          })}
        </Grid>
      )}
    </Grid>
  )
}

export default StatusModifiers
