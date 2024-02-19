import { Button, Grid, ListItemIcon, TextField } from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import StatsInputContainer from 'components/StatsInputContainer'
import { useAtom } from 'jotai'
import _ from 'lodash'
import React, { Fragment, useMemo } from 'react'
import { spellAtom } from 'infrastructure/dataAccess/atoms'
import { replaceItemAtIndex } from 'utils/utils'
import { makeStyles } from 'tss-react/mui'
import { arrayMoveImmutable } from 'array-move'
import { Container, Draggable } from 'react-smooth-dnd'
import DragHandleIcon from '@mui/icons-material/DragHandle'

export const useStyles = makeStyles()(() => ({
  draggableContainer: {
    position: 'relative'
  },
  dragIconContainer: {
    position: 'absolute',
    right: '1em',
    zIndex: '100',
    cursor: 'pointer',
    minWidth: 'auto',
    justifyContent: 'end',
    '& > svg': {
      fontSize: '1.5em'
    }
  }
}))

export const SpellStatsInput: React.FC = () => {
  const [currentSpell, setCurrentSpell] = useAtom(useMemo(() => spellAtom, []))
  const { classes } = useStyles()

  const onDrop = ({ removedIndex, addedIndex }: { removedIndex: any; addedIndex: any }) => {
    setCurrentSpell((spell) => {
      if (spell) {
        return {
          ...spell,
          features: arrayMoveImmutable(spell.features, removedIndex, addedIndex)
        }
      }
    })
  }

  const onChange = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target
    setCurrentSpell((spell) => {
      if (spell) {
        return { ...spell, [name]: value }
      }
    })
  }

  const onDeleteFeature = (index: number) => () => {
    setCurrentSpell((spell) => {
      if (spell) {
        const featuresCopy = [...spell.features]
        featuresCopy.splice(index, 1)
        return {
          ...spell,
          features: featuresCopy
        }
      }
    })
  }

  const onChangeFeatureName = (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target
    setCurrentSpell((spell) => {
      if (spell) {
        const featuresCopy = replaceItemAtIndex(spell.features, index, {
          featureName: value,
          featureDescription: spell.features[index].featureDescription
        })
        return {
          ...spell,
          features: featuresCopy
        }
      }
    })
  }

  const onChangeFeatureDescription = (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target
    setCurrentSpell((spell) => {
      if (spell) {
        const featuresCopy = replaceItemAtIndex(spell.features, index, {
          featureName: spell.features[index].featureName,
          featureDescription: value
        })
        return {
          ...spell,
          features: featuresCopy
        }
      }
    })
  }

  const onAddFeature = () => {
    setCurrentSpell((spell) => {
      if (spell) {
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
      }
    })
  }

  if (!currentSpell) {
    return null
  }

  return (
    <StatsInputContainer>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <TextField id="spell-name" label="Name" value={currentSpell.name} onChange={onChange('name')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField
            id="spell-short-description"
            label="Short Description"
            value={currentSpell.shortDescription}
            onChange={onChange('shortDescription')}
          />
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
          <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
            {!_.isEmpty(currentSpell.features) &&
              currentSpell.features.map((feature, index) => {
                return (
                  <Draggable key={index} className={`${classes.draggableContainer}`}>
                    <FeatureInputContainer onDelete={onDeleteFeature(index)}>
                      <ListItemIcon className={`drag-handle ${classes.dragIconContainer}`}>
                        <DragHandleIcon fontSize="large" />
                      </ListItemIcon>
                      <TextField
                        id={`item-${index}-feature-name`}
                        label="Feature Name"
                        value={feature.featureName}
                        onChange={onChangeFeatureName(index)}
                      />
                      <TextField
                        id={`item-${index}-feature-description`}
                        label="Feature Description"
                        value={feature.featureDescription}
                        multiline={true}
                        onChange={onChangeFeatureDescription(index)}
                      />
                    </FeatureInputContainer>
                  </Draggable>
                )
              })}
          </Container>
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
