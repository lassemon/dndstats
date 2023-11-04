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
          Resistances:{' '}
          {(resistances || []).map((resistance, resistanceIndex) => {
            return (
              <React.Fragment key={resistanceIndex}>
                <Typography variant="body2">
                  <span>{resistance}</span>
                  <br />
                </Typography>
              </React.Fragment>
            )
          })}
        </Grid>
      )}
      {vulnerabilities && !_.isEmpty(vulnerabilities) && (
        <Grid item={true}>
          Vulnerabilities:{' '}
          {(vulnerabilities || []).map((vulnerability, vulnerabilityIndex) => {
            return (
              <React.Fragment key={vulnerabilityIndex}>
                <Typography variant="body2">
                  <span>{vulnerability}</span>
                  <br />
                </Typography>
              </React.Fragment>
            )
          })}
        </Grid>
      )}
      {immunities && !_.isEmpty(immunities) && (
        <Grid item={true}>
          Immunities:{' '}
          {(immunities || []).map((immunity, immunityIndex) => {
            return (
              <React.Fragment key={immunityIndex}>
                <Typography variant="body2">
                  <span>{immunity}</span>
                  <br />
                </Typography>
              </React.Fragment>
            )
          })}
        </Grid>
      )}
    </Grid>
  )
}

export default StatusModifiers
