import { Autocomplete, Box, Button, ListItemIcon, Switch, TextField, Tooltip } from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import TaperedRule from 'components/TaperedRule'
import { useAtom } from 'jotai'
import React, { useMemo } from 'react'
import { weaponAtom } from 'infrastructure/dataAccess/atoms'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { makeStyles } from 'tss-react/mui'
import { arrayMoveImmutable } from 'array-move'
import { Container, Draggable } from 'react-smooth-dnd'
import ScreenshotButton from 'components/ScreenshotButton'
import { AutoCompleteItem } from 'components/Autocomplete/AutocompleteItem'
import { WeaponProperty } from '@dmtool/domain'

export const useStyles = makeStyles()(() => ({
  draggableContainer: {},
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

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

interface WeaponStatsInputProps {
  screenshotMode?: boolean
  setScreenshotMode?: React.Dispatch<React.SetStateAction<boolean>>
}

export const WeaponStatsInput: React.FC<WeaponStatsInputProps> = ({ screenshotMode, setScreenshotMode }) => {
  const [currentWeapon, setCurrentWeapon] = useAtom(useMemo(() => weaponAtom, []))
  const { classes } = useStyles()

  const onDrop = ({ removedIndex, addedIndex }: { removedIndex: any; addedIndex: any }) => {
    setCurrentWeapon((weapon) => {
      if (weapon) {
        return {
          ...weapon,
          features: arrayMoveImmutable(weapon.features, removedIndex, addedIndex)
        }
      }
    })
  }

  const onChange = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    event.preventDefault()
    const { value } = event.target
    setCurrentWeapon((weapon) => {
      if (weapon) {
        return { ...weapon, [name]: value }
      }
    })
  }

  const onAddFeature = () => {
    setCurrentWeapon((weapon) => {
      if (weapon) {
        return {
          ...weapon,
          features: [
            ...weapon.features,
            {
              featureName: 'Feature name',
              featureDescription: 'Feature description'
            }
          ]
        }
      }
    })
  }

  const onChangeFeatureName = (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target
    setCurrentWeapon((weapon) => {
      if (weapon) {
        const featuresCopy = replaceItemAtIndex(weapon.features, index, {
          featureName: value,
          featureDescription: weapon.features[index].featureDescription
        })
        return {
          ...weapon,
          features: featuresCopy
        }
      }
    })
  }

  const onChangeFeatureDescription = (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target
    setCurrentWeapon((weapon) => {
      if (weapon) {
        const featuresCopy = replaceItemAtIndex(weapon.features, index, {
          featureName: weapon.features[index].featureName,
          featureDescription: value
        })

        return {
          ...weapon,
          features: featuresCopy
        }
      }
    })
  }

  const onDeleteFeature = (index: number) => () => {
    setCurrentWeapon((weapon) => {
      if (weapon) {
        const featuresCopy = [...weapon.features]
        featuresCopy.splice(index, 1)
        return {
          ...weapon,
          features: featuresCopy
        }
      }
    })
  }

  const onChangeProperties = (event: React.SyntheticEvent<Element, Event>, newPropertyList: WeaponProperty[]) => {
    setCurrentWeapon((weapon) => {
      if (weapon) {
        return {
          ...weapon,
          properties: newPropertyList
        }
      }
    })
  }

  const onDeleteImage = () => {
    setCurrentWeapon((weapon) => {
      if (weapon) {
        return {
          ...weapon,
          image: React.createElement('img', {
            width: 200,
            alt: '',
            src: '',
            hash: 0
          })
        }
      }
    })
  }

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = (event.target.files || [])[0]

    if (imageFile) {
      var reader = new FileReader()

      reader.onload = (event) => {
        if (event && event.target) {
          const imgtag = React.createElement('img', {
            width: 200,
            alt: imageFile.name,
            src: (event.target.result || '') as string,
            hash: Date.now()
          })

          setCurrentWeapon((weapon) => {
            if (weapon) {
              return {
                ...weapon,
                image: imgtag
              }
            }
          })
        }
      }

      reader.readAsDataURL(imageFile)
    }
  }

  const onToggleScreenshotMode = () => {
    if (setScreenshotMode) {
      setScreenshotMode((_screenshotMode) => !_screenshotMode)
    }
  }

  if (!currentWeapon) {
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
      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />
      <TextField id="weapon-name" label="Name" value={currentWeapon.name} onChange={onChange('name')} />
      <TextField
        id="weapon-short-description"
        label="Short Description"
        value={currentWeapon.shortDescription}
        onChange={onChange('shortDescription')}
      />
      <TextField
        id="weapon-main-description"
        label="Main Description"
        multiline={true}
        value={currentWeapon.mainDescription}
        onChange={onChange('mainDescription')}
      />
      <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
        {currentWeapon.features.map((feature, index) => {
          return (
            <Draggable key={index} className={classes.draggableContainer}>
              <FeatureInputContainer onDelete={onDeleteFeature(index)}>
                <ListItemIcon className={`drag-handle ${classes.dragIconContainer}`}>
                  <DragHandleIcon fontSize="large" />
                </ListItemIcon>
                <TextField
                  id={`weapon-${index}-feature-name`}
                  label="Feature Name"
                  value={feature.featureName}
                  onChange={onChangeFeatureName(index)}
                />
                <TextField
                  id={`weapon-${index}-feature-description`}
                  label="Feature Description"
                  multiline={true}
                  value={feature.featureDescription}
                  onChange={onChangeFeatureDescription(index)}
                />
              </FeatureInputContainer>
              {currentWeapon.features.length > 1 && index < currentWeapon.features.length - 1 && <TaperedRule />}
            </Draggable>
          )
        })}
      </Container>
      <div style={{ textAlign: 'end' }}>
        <Button variant="contained" color="primary" onClick={onAddFeature}>
          Add feature
        </Button>
      </div>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <TextField id="weapon-damage" label="Damage" value={currentWeapon.damage.damageDice} onChange={onChange('damage')} />
          <TextField id="weapon-weight" label="Weight" value={currentWeapon.weight} onChange={onChange('weight')} />
        </Box>
        <Autocomplete
          multiple
          clearOnBlur
          disableCloseOnSelect
          value={currentWeapon.properties as WeaponProperty[]}
          options={Object.values(WeaponProperty)}
          onChange={onChangeProperties}
          getOptionLabel={(option) => option.replaceAll('_', ' ')}
          style={{ width: '100%' }}
          PaperComponent={AutoCompleteItem}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Properties"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
          sx={{ width: '100%' }}
        />
      </Box>
    </StatsInputContainer>
  )
}

export default WeaponStatsInput
