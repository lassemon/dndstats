import { Button, TextField } from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import TaperedRule from 'components/TaperedRule'
import { useAtom } from 'jotai'
import React, { Fragment, useMemo } from 'react'
import { itemState } from 'infrastructure/dataAccess/atoms'

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const ItemStatsInput: React.FC = () => {
  const [currentItem, setCurrentItem] = useAtom(useMemo(() => itemState, []))

  const onChange = (name: string) => (event: any) => {
    const newValue = event.target.value
    setCurrentItem((item) => {
      if (item) {
        return { ...item, [name]: newValue }
      }
    })
  }

  const onAddFeature = () => {
    setCurrentItem((item) => {
      if (item) {
        return {
          ...item,
          features: [
            ...item.features,
            {
              featureName: 'Feature name',
              featureDescription: 'Feature description'
            }
          ]
        }
      }
    })
  }

  const onChangeFeatureName = (index: number) => (event: any) => {
    setCurrentItem((item) => {
      if (item) {
        const featuresCopy = replaceItemAtIndex(item.features, index, {
          featureName: event.target.value,
          featureDescription: item.features[index].featureDescription
        })
        return {
          ...item,
          features: featuresCopy
        }
      }
    })
  }

  const onChangeFeatureDescription = (index: number) => (event: any) => {
    setCurrentItem((item) => {
      if (item) {
        const featuresCopy = replaceItemAtIndex(item.features, index, {
          featureName: item.features[index].featureName,
          featureDescription: event.target.value
        })
        return {
          ...item,
          features: featuresCopy
        }
      }
    })
  }

  const onDeleteFeature = (index: number) => () => {
    setCurrentItem((item) => {
      if (item) {
        const featuresCopy = [...item.features]
        featuresCopy.splice(index, 1)
        return {
          ...item,
          features: featuresCopy
        }
      }
    })
  }

  const onDeleteImage = () => {
    setCurrentItem((item) => {
      if (item) {
        return {
          ...item,
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

  const onUpload = (event: any) => {
    const imageFile = event.target.files[0]

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

          setCurrentItem((item) => {
            if (item) {
              return {
                ...item,
                image: imgtag
              }
            }
          })
        }
      }

      reader.readAsDataURL(imageFile)
    }
  }

  if (!currentItem) {
    return null
  }

  return (
    <StatsInputContainer>
      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />
      <TextField id="item-name" label="Name" value={currentItem.name} onChange={onChange('name')} />
      <TextField id="item-short-description" label="Short Description" value={currentItem.shortDescription} onChange={onChange('shortDescription')} />
      <TextField
        id="item-main-description"
        label="Main Description"
        value={currentItem.mainDescription}
        multiline={true}
        onChange={onChange('mainDescription')}
      />
      {currentItem.features.map((feature: any, key: any) => {
        return (
          <Fragment key={key}>
            <FeatureInputContainer onDelete={onDeleteFeature(key)}>
              <TextField id={`item-${key}-feature-name`} label="Feature Name" value={feature.featureName} onChange={onChangeFeatureName(key)} />
              <TextField
                id={`item-${key}-feature-description`}
                label="Feature Description"
                value={feature.featureDescription}
                multiline={true}
                onChange={onChangeFeatureDescription(key)}
              />
            </FeatureInputContainer>
            {currentItem.features.length > 1 && key < currentItem.features.length - 1 && <TaperedRule />}
          </Fragment>
        )
      })}
      <Button variant="contained" color="primary" onClick={onAddFeature}>
        Add feature
      </Button>
    </StatsInputContainer>
  )
}

export default ItemStatsInput
