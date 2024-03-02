import { Box, Button, Grid, ListItemIcon, Switch, TextField, Tooltip } from '@mui/material'
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
import ScreenshotButton from 'components/ScreenshotButton'

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

interface SpellStatsInputProps {
  screenshotMode?: boolean
  setScreenshotMode?: React.Dispatch<React.SetStateAction<boolean>>
}

export const SpellStatsInput: React.FC<SpellStatsInputProps> = ({ screenshotMode, setScreenshotMode }) => {
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

  const onToggleScreenshotMode = () => {
    if (setScreenshotMode) {
      setScreenshotMode((_screenshotMode) => !_screenshotMode)
    }
  }

  if (!currentSpell) {
    return null
  }

  return (
    <StatsInputContainer>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1em' }}>
        <Tooltip title="Toggle screenshot mode" placement="top-end">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ScreenshotButton onClick={onToggleScreenshotMode} color={screenshotMode ? 'secondary' : 'default'} sx={{ paddingBottom: 0 }} />
            <Switch onClick={onToggleScreenshotMode} checked={screenshotMode} sx={{ marginTop: '-10px' }} color="secondary" />
          </div>
        </Tooltip>
      </div>
      <TextField id="spell-name" label="Name" value={currentSpell.name} onChange={onChange('name')} />
      <div style={{ display: 'flex', gap: '2em' }}>
        <TextField
          id="spell-short-description"
          label="Short Description"
          value={currentSpell.shortDescription}
          onChange={onChange('shortDescription')}
        />
        <TextField id="spell-casting-time" label="Casting Time" value={currentSpell.castingtime} onChange={onChange('castingtime')} />
        <TextField id="spell-range" label="Range" value={currentSpell.range} onChange={onChange('range')} />
      </div>
      <div style={{ display: 'flex', gap: '2em' }}>
        <TextField id="spell-components" label="Components" value={currentSpell.components} onChange={onChange('components')} />
        <TextField id="spell-duration" label="Duration" value={currentSpell.duration} onChange={onChange('duration')} />
        <TextField id="spell-classes" label="Classes" value={currentSpell.classes} onChange={onChange('classes')} />
      </div>
      <TextField
        id="spell-main-description"
        label="Main Description"
        value={currentSpell.mainDescription}
        multiline={true}
        onChange={onChange('mainDescription')}
      />
      <Container
        dragHandleSelector=".drag-handle"
        lockAxis="y"
        onDrop={onDrop}
        style={{ display: _.isEmpty(currentSpell.features) ? 'none' : 'block' }}
      >
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
      <div style={{ textAlign: 'right' }}>
        <Button variant="contained" color="primary" onClick={onAddFeature}>
          Add feature
        </Button>
      </div>
      <TextField
        id="spell-at-higher-levels"
        label="At higher levels"
        value={currentSpell.athigherlevels}
        multiline={true}
        onChange={onChange('athigherlevels')}
      />
    </StatsInputContainer>
  )
}

export default SpellStatsInput
