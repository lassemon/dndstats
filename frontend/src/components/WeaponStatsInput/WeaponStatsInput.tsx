import { Button, Grid, TextField } from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import TaperedRule from 'components/TaperedRule'
import { useAtom } from 'jotai'
import React, { Fragment, useMemo } from 'react'
import { weaponAtom } from 'infrastructure/dataAccess/atoms'

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const WeaponStatsInput: React.FC = () => {
  const [currentWeapon, setCurrentWeapon] = useAtom(useMemo(() => weaponAtom, []))

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

  if (!currentWeapon) {
    return null
  }

  return (
    <StatsInputContainer>
      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />
      <TextField id="weapon-name" label="Name" value={currentWeapon.name} onChange={onChange('name')} />
      <TextField id="weapon-short-description" label="Short Description" value={currentWeapon.shortDescription} onChange={onChange('shortDescription')} />
      <TextField
        id="weapon-main-description"
        label="Main Description"
        multiline={true}
        value={currentWeapon.mainDescription}
        onChange={onChange('mainDescription')}
      />
      {currentWeapon.features.map((feature, key) => {
        return (
          <Fragment key={key}>
            <FeatureInputContainer onDelete={onDeleteFeature(key)}>
              <TextField id={`weapon-${key}-feature-name`} label="Feature Name" value={feature.featureName} onChange={onChangeFeatureName(key)} />
              <TextField
                id={`weapon-${key}-feature-description`}
                label="Feature Description"
                multiline={true}
                value={feature.featureDescription}
                onChange={onChangeFeatureDescription(key)}
              />
            </FeatureInputContainer>
            {currentWeapon.features.length > 1 && key < currentWeapon.features.length - 1 && <TaperedRule />}
          </Fragment>
        )
      })}
      <Button variant="contained" color="primary" onClick={onAddFeature}>
        Add feature
      </Button>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={4}>
          <TextField id="weapon-damage" label="Damage" value={currentWeapon.damage} onChange={onChange('damage')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField id="weapon-weight" label="Weight" value={currentWeapon.weight} onChange={onChange('weight')} />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField id="weapon-properties" label="Properties" value={currentWeapon.properties} onChange={onChange('properties')} />
        </Grid>
      </Grid>
    </StatsInputContainer>
  )
}

export default WeaponStatsInput
