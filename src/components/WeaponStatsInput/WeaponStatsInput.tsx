import { Button, IconButton, TextField } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import PublishIcon from '@material-ui/icons/Publish'
import TaperedRule from 'components/TaperedRule'
import React, { Fragment } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { weaponState } from 'recoil/atoms'

import useStyles from './WeaponStatsInput.styles'

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const WeaponStatsInput: React.FC = () => {
  const classes = useStyles()
  const currentWeapon = useRecoilValue(weaponState)
  const setCurrentWeapon = useSetRecoilState(weaponState)

  const onChange = (name: string) => (event: any) =>
    setCurrentWeapon((weapon) => {
      return { ...weapon, [name]: event.target.value }
    })

  const onAddFeature = () => {
    setCurrentWeapon((weapon) => {
      return {
        ...weapon,
        features: [
          ...weapon.features,
          {
            featureName: "Feature name",
            featureDescription: "Feature description",
          },
        ],
      }
    })
  }

  const onChangeFeatureName = (index: number) => (event: any) => {
    setCurrentWeapon((weapon) => {
      const featuresCopy = replaceItemAtIndex(weapon.features, index, {
        featureName: event.target.value,
        featureDescription: weapon.features[index].featureDescription,
      })
      return {
        ...weapon,
        features: featuresCopy,
      }
    })
  }

  const onChangeFeatureDescription = (index: number) => (event: any) => {
    setCurrentWeapon((weapon) => {
      const featuresCopy = replaceItemAtIndex(weapon.features, index, {
        featureName: weapon.features[index].featureName,
        featureDescription: event.target.value,
      })
      return {
        ...weapon,
        features: featuresCopy,
      }
    })
  }

  const onDeleteFeature = (index: number) => () => {
    setCurrentWeapon((weapon) => {
      const featuresCopy = [...weapon.features]
      featuresCopy.splice(index, 1)
      return {
        ...weapon,
        features: featuresCopy,
      }
    })
  }

  const onDeleteImage = () => {
    setCurrentWeapon((weapon) => {
      return {
        ...weapon,
        image: React.createElement("img", {
          width: 200,
          alt: "",
          src: "",
        }),
      }
    })
  }

  const onUpload = (event: any) => {
    const imageFile = event.target.files[0]

    if (imageFile) {
      var reader = new FileReader()

      reader.onload = (event) => {
        if (event && event.target) {
          const imgtag = React.createElement("img", {
            width: 200,
            alt: imageFile.name,
            src: (event.target.result || "") as string,
          })

          setCurrentWeapon((weapon) => {
            return {
              ...weapon,
              image: imgtag,
            }
          })
        }
      }

      reader.readAsDataURL(imageFile)
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.bottomButtons}>
        <Button component="label">
          Upload image for weapon
          <input
            type="file"
            accept="image/*"
            name="image"
            id="file"
            onChange={onUpload}
            style={{
              display: "none",
            }}
          />
          <PublishIcon fontSize="large" />
        </Button>
        <Button onClick={onDeleteImage} className={classes.deleteButton}>
          Clear image
          <DeleteIcon fontSize="large" />
        </Button>
      </div>
      <TextField
        id="weapon-name"
        label="Name"
        value={currentWeapon.name}
        onChange={onChange("name")}
      />
      <TextField
        id="weapon-short-description"
        label="Short Description"
        value={currentWeapon.shortDescription}
        onChange={onChange("shortDescription")}
      />
      <TextField
        id="weapon-main-description"
        label="Main Description"
        multiline={true}
        value={currentWeapon.mainDescription}
        onChange={onChange("mainDescription")}
      />
      {currentWeapon.features.map((feature, key) => {
        return (
          <Fragment key={key}>
            <div className={classes.featureContainer}>
              <TextField
                id={`weapon-${key}-feature-name`}
                label="Feature Name"
                value={feature.featureName}
                onChange={onChangeFeatureName(key)}
              />
              <TextField
                id={`weapon-${key}-feature-description`}
                label="Feature Description"
                multiline={true}
                value={feature.featureDescription}
                onChange={onChangeFeatureDescription(key)}
              />
              <div className={classes.deleteButtonContainer}>
                <IconButton
                  aria-label="delete"
                  className={classes.deleteButton}
                  onClick={onDeleteFeature(key)}
                >
                  <DeleteIcon fontSize="large" />
                </IconButton>
              </div>
            </div>
            {currentWeapon.features.length > 1 &&
              key < currentWeapon.features.length - 1 && <TaperedRule />}
          </Fragment>
        )
      })}
      <Button variant="contained" color="primary" onClick={onAddFeature}>
        Add feature
      </Button>
      <TextField
        id="weapon-damage"
        label="Damage"
        value={currentWeapon.damage}
        onChange={onChange("damage")}
      />
      <TextField
        id="weapon-weight"
        label="Weight"
        value={currentWeapon.weight}
        onChange={onChange("weight")}
      />
      <TextField
        id="weapon-properties"
        label="Properties"
        value={currentWeapon.properties}
        onChange={onChange("properties")}
      />
    </div>
  )
}

export default WeaponStatsInput
