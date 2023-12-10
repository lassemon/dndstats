import { Button, Grid, TextField } from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import StatsInputContainer from 'components/StatsInputContainer'
import _ from 'lodash'
import React, { Fragment } from 'react'
import { useRecoilState } from 'recoil'
import { spellState } from 'recoil/atoms'
import { replaceItemAtIndex } from 'utils/utils'

export const SpellStatsInput: React.FC = () => {
  const [currentSpell, setCurrentSpell] = useRecoilState(spellState)

  const onChange = (name: string) => (event: any) => {
    setCurrentSpell((spell) => {
      return { ...spell, [name]: event.target.value }
    })
  }

  const onDeleteFeature = (index: number) => () => {
    setCurrentSpell((spell) => {
      const featuresCopy = [...spell.features]
      featuresCopy.splice(index, 1)
      return {
        ...spell,
        features: featuresCopy
      }
    })
  }

  const onChangeFeatureName = (index: number) => (event: any) => {
    setCurrentSpell((spell) => {
      const featuresCopy = replaceItemAtIndex(spell.features, index, {
        featureName: event.target.value,
        featureDescription: spell.features[index].featureDescription
      })
      return {
        ...spell,
        features: featuresCopy
      }
    })
  }

  const onChangeFeatureDescription = (index: number) => (event: any) => {
    setCurrentSpell((spell) => {
      const featuresCopy = replaceItemAtIndex(spell.features, index, {
        featureName: spell.features[index].featureName,
        featureDescription: event.target.value
      })
      return {
        ...spell,
        features: featuresCopy
      }
    })
  }

  const onAddFeature = () => {
    setCurrentSpell((spell) => {
      return {
        ...spell,
        features: [
          ...(spell.features || []),
          {
            featureName: 'Feature name',
            featureDescription: 'Feature description'
          }
        ]
      }
    })
  }

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
          {!_.isEmpty(currentSpell.features) &&
            currentSpell.features.map((feature, index) => {
              return (
                <Fragment key={index}>
                  <FeatureInputContainer onDelete={onDeleteFeature(index)}>
                    <TextField id={`item-${index}-feature-name`} label="Feature Name" value={feature.featureName} onChange={onChangeFeatureName(index)} />
                    <TextField
                      id={`item-${index}-feature-description`}
                      label="Feature Description"
                      value={feature.featureDescription}
                      multiline={true}
                      onChange={onChangeFeatureDescription(index)}
                    />
                  </FeatureInputContainer>
                </Fragment>
              )
            })}
          <Button variant="contained" color="primary" onClick={onAddFeature}>
            Add feature
          </Button>
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
