import { Button, IconButton, TextField } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import PublishIcon from '@material-ui/icons/Publish'
import TaperedRule from 'components/TaperedRule'
import React, { Fragment } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { itemState } from 'recoil/atoms'

import useStyles from './ItemStatsInput.styles'

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const ItemStatsInput: React.FC = () => {
  const classes = useStyles()
  const currentItem = useRecoilValue(itemState)
  const setCurrentItem = useSetRecoilState(itemState)

  const onChange = (name: string) => (event: any) =>
    setCurrentItem((item) => {
      return { ...item, [name]: event.target.value }
    })

  const onAddFeature = () => {
    setCurrentItem((item) => {
      return {
        ...item,
        features: [
          ...item.features,
          {
            featureName: "Feature name",
            featureDescription: "Feature description",
          },
        ],
      }
    })
  }

  const onChangeFeatureName = (index: number) => (event: any) => {
    setCurrentItem((item) => {
      const featuresCopy = replaceItemAtIndex(item.features, index, {
        featureName: event.target.value,
        featureDescription: item.features[index].featureDescription,
      })
      return {
        ...item,
        features: featuresCopy,
      }
    })
  }

  const onChangeFeatureDescription = (index: number) => (event: any) => {
    setCurrentItem((item) => {
      const featuresCopy = replaceItemAtIndex(item.features, index, {
        featureName: item.features[index].featureName,
        featureDescription: event.target.value,
      })
      return {
        ...item,
        features: featuresCopy,
      }
    })
  }

  const onDeleteFeature = (index: number) => () => {
    setCurrentItem((item) => {
      const featuresCopy = [...item.features]
      featuresCopy.splice(index, 1)
      return {
        ...item,
        features: featuresCopy,
      }
    })
  }

  const onDeleteImage = () => {
    setCurrentItem((item) => {
      return {
        ...item,
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

          setCurrentItem((item) => {
            return {
              ...item,
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
          Upload image for item
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
        value={currentItem.name}
        onChange={onChange("name")}
      />
      <TextField
        id="weapon-short-description"
        label="Short Description"
        value={currentItem.shortDescription}
        onChange={onChange("shortDescription")}
      />
      <TextField
        id="weapon-main-description"
        label="Main Description"
        value={currentItem.mainDescription}
        onChange={onChange("mainDescription")}
      />
      {currentItem.features.map((feature, key) => {
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
            {currentItem.features.length > 1 &&
              key < currentItem.features.length - 1 && <TaperedRule />}
          </Fragment>
        )
      })}
      <Button variant="contained" color="primary" onClick={onAddFeature}>
        Add feature
      </Button>
    </div>
  )
}

export default ItemStatsInput
