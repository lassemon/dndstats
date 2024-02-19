import { Button, FormControl, InputLabel, ListItemIcon, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import TaperedRule from 'components/TaperedRule'
import React, { useEffect, useRef } from 'react'
import { EntityType, Source, Visibility } from '@dmtool/domain'
import { UpdateParam } from 'state/itemAtom'
import { uuid } from '@dmtool/common'
import { useAtom } from 'jotai'
import { authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import { unixtimeNow } from 'utils/utils'
import { FrontendItemRepositoryInterface } from 'infrastructure/repositories/ItemRepository'
import { ImageDTO, ItemDTO } from '@dmtool/application'
import { ItemRarity } from 'domain/services/FifthESRDService'
import { capitalize } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { makeStyles } from 'tss-react/mui'
import { arrayMoveImmutable } from 'array-move'

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

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

interface ItemStatsInputProps {
  item: ItemDTO | null
  setItem: (update: UpdateParam<ItemDTO | null>) => void
  setImage: (update: UpdateParam<ImageDTO | null | undefined>) => void
  itemRepository: FrontendItemRepositoryInterface
}

export const ItemStatsInput: React.FC<ItemStatsInputProps> = ({ item, setItem, itemRepository, setImage }) => {
  const controllersRef = useRef<AbortController[]>([])
  const { classes } = useStyles()

  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const [authState] = useAtom(authAtom)

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => controller.abort())
    }
  }, [])

  const onDrop = ({ removedIndex, addedIndex }: { removedIndex: any; addedIndex: any }) => {
    setItem((_item) => {
      if (_item) {
        return _item?.clone({
          features: arrayMoveImmutable(_item.features, removedIndex, addedIndex)
        })
      }
    })
  }

  const onChange = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
    const { value } = event.target
    setItem((_item) => {
      if (_item) {
        return _item.clone({ [name]: value })
      }
    })
  }

  const onAddFeature = () => {
    setItem((_item) => {
      if (_item) {
        return _item?.clone({
          features: [
            ..._item.features,
            {
              featureName: 'Feature name',
              featureDescription: 'Feature description'
            }
          ]
        })
      }
    })
  }

  const onChangeFeatureName = (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target
    setItem((_item) => {
      if (_item) {
        const featuresCopy = replaceItemAtIndex(_item.features, index, {
          featureName: value,
          featureDescription: _item.features[index].featureDescription
        })
        return _item.clone({ features: featuresCopy })
      }
    })
  }

  const onChangeFeatureDescription = (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target
    setItem((_item) => {
      if (_item) {
        const featuresCopy = replaceItemAtIndex(_item.features, index, {
          featureName: _item.features[index].featureName,
          featureDescription: value
        })
        return _item.clone({ features: featuresCopy })
      }
    })
  }

  const onDeleteFeature = (index: number) => () => {
    setItem((_item) => {
      if (_item) {
        const featuresCopy = [..._item.features]
        featuresCopy.splice(index, 1)
        return _item.clone({ features: featuresCopy })
      }
    })
  }

  const onDeleteImage = () => {
    setItem((_item) => {
      return _item?.clone({ imageId: null })
    })
    setImage(null)
  }

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = (event.target.files || [])[0]

    if (item && imageFile) {
      var reader = new FileReader()

      reader.onload = (event) => {
        if (event && event.target) {
          const imageBase64 = (event.target.result || '') as string

          setImage((_image) => {
            const now = unixtimeNow()
            const newImage = _image
              ? _image.parseForSaving(imageBase64)
              : new ImageDTO({
                  metadata: {
                    id: uuid(),
                    createdAt: now,
                    visibility: Visibility.PUBLIC,
                    fileName: imageFile.name,
                    size: imageFile.size,
                    mimeType: imageFile.type,
                    createdBy: authState.user?.id || '0',
                    updatedAt: now,
                    source: Source.HomeBrew,
                    ownerId: item.id,
                    ownerType: EntityType.ITEM
                  },
                  base64: imageBase64
                }).parseForSaving(imageBase64)
            // upload new image with associated item also to the backend, if successful, set the persisted image to the frontend atom
            if (authState.loggedIn) {
              const controller = new AbortController()
              controllersRef.current.push(controller)
              itemRepository
                .save(item, newImage, { signal: controller.signal })
                .then((itemSaveResponse) => {
                  setItem(new ItemDTO(itemSaveResponse.item))
                  setImage(itemSaveResponse.image ? new ImageDTO(itemSaveResponse.image) : null)
                })
                .catch((error) => {
                  setImage(newImage ? new ImageDTO(newImage) : null)
                  setError(error)
                })
            }
            return _image
          })
        }
      }

      reader.readAsDataURL(imageFile)
    }
  }

  if (item === null) {
    return null
  }

  return (
    <StatsInputContainer>
      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />
      <div style={{ display: 'flex', gap: '2em' }}>
        <TextField
          id="item-price"
          label="Price"
          value={item.price}
          onChange={onChange('price')}
          InputLabelProps={{
            shrink: true
          }}
        />

        <TextField
          id="item-weight"
          label="Weight"
          value={item.weight}
          onChange={onChange('weight')}
          InputLabelProps={{
            shrink: true
          }}
        />
        <FormControl sx={{ m: 0, flex: '0 0 14em' }} size="small">
          <InputLabel shrink id="rarity">
            Rarity
          </InputLabel>
          <Select labelId={'rarity'} id="rarity-select" value={item.rarity || ''} label="Rarity" onChange={onChange('rarity')}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Object.values(ItemRarity).map((value, index) => {
              return (
                <MenuItem key={index} value={value}>
                  {value
                    .replaceAll('_', ' ')
                    .split(' ')
                    .map((part) => capitalize(part))
                    .join(' ')}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        {authState.loggedIn && (
          <FormControl sx={{ m: 0, flex: '0 0 14em' }} size="small">
            <InputLabel shrink id="visibility">
              Visibility
            </InputLabel>
            <Select
              labelId={'visibility'}
              id="visibility-select"
              value={item.visibility || ''}
              label="Visibility"
              onChange={onChange('visibility')}
            >
              {Object.values(Visibility).map((value, index) => {
                return (
                  <MenuItem key={index} value={value}>
                    {value
                      .replaceAll('_', ' ')
                      .split(' ')
                      .map((part) => capitalize(part))
                      .join(' ')}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        )}
      </div>
      <TextField
        id="item-name"
        label="Name"
        value={item.name}
        onChange={onChange('name')}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        id="item-short-description"
        label="Short Description"
        value={item.shortDescription}
        onChange={onChange('shortDescription')}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        id="item-main-description"
        label="Main Description"
        value={item.mainDescription}
        multiline={true}
        onChange={onChange('mainDescription')}
        InputLabelProps={{
          shrink: true
        }}
      />
      <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
        {item.features.map((feature: any, index: any) => {
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
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <TextField
                  id={`item-${index}-feature-description`}
                  label="Feature Description"
                  value={feature.featureDescription}
                  multiline={true}
                  onChange={onChangeFeatureDescription(index)}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </FeatureInputContainer>
              {item.features.length > 1 && index < item.features.length - 1 && <TaperedRule />}
            </Draggable>
          )
        })}
      </Container>
      <Button variant="contained" color="primary" onClick={onAddFeature}>
        Add feature
      </Button>
    </StatsInputContainer>
  )
}

export default ItemStatsInput
