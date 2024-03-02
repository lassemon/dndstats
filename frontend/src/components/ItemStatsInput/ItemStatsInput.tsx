import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import TaperedRule from 'components/TaperedRule'
import React, { useEffect, useRef, useState } from 'react'
import { EntityType, Item, Source, Visibility } from '@dmtool/domain'
import { UpdateParam } from 'state/itemAtom'
import { unixtimeNow, uuid } from '@dmtool/common'
import { useAtom } from 'jotai'
import { authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import { FrontendItemRepositoryInterface } from 'infrastructure/repositories/ItemRepository'
import { ITEM_DEFAULTS, ImageDTO, ItemDTO } from '@dmtool/application'
import { ItemRarity } from 'domain/services/FifthESRDService'
import _, { capitalize } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { makeStyles } from 'tss-react/mui'
import { arrayMoveImmutable } from 'array-move'
import { useNavigate } from 'react-router-dom'
import { AutocompleteGroupHeader, AutocompleteGroupItems } from 'components/Autocomplete/AutocompleteGroup'
import { AutoCompleteItem } from 'components/Autocomplete/AutocompleteItem'
import { ItemListOption, emptyItem, loggedInEmptyItem } from 'domain/entities/Item'
import { newItemDTO } from 'services/defaults'
import DeleteButton from 'components/DeleteButton'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SaveButton from 'components/SaveButton'
import PlusButton from 'components/PlusButton'
import ScreenshotButton from 'components/ScreenshotButton'

const itemToItemListOption = (item: Item | ItemDTO): ItemListOption => {
  return {
    id: item.id,
    name: item.name,
    source: item.source
  }
}

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const useStyles = makeStyles()(() => ({
  statsInputContainer: {
    position: 'relative'
  },
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
  persistedItem: ItemDTO | null
  setItem: (update: UpdateParam<ItemDTO | null>) => void
  setPersistedItem: React.Dispatch<React.SetStateAction<ItemDTO | null>>
  setItemId: React.Dispatch<React.SetStateAction<string | undefined>>
  image?: ImageDTO | null
  setImage: (update: UpdateParam<ImageDTO | null | undefined>) => void
  itemRepository: FrontendItemRepositoryInterface
  screenshotMode?: boolean
  setScreenshotMode?: React.Dispatch<React.SetStateAction<boolean>>
}

export const ItemStatsInput: React.FC<ItemStatsInputProps> = ({
  item,
  persistedItem,
  setItem,
  setPersistedItem,
  setItemId,
  itemRepository,
  image,
  setImage,
  screenshotMode,
  setScreenshotMode
}) => {
  const controllersRef = useRef<AbortController[]>([])
  const { classes } = useStyles()
  const [errorState, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const navigate = useNavigate()

  const [authState] = useAtom(authAtom)

  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('xl'))

  const emptyListItem = authState.loggedIn ? loggedInEmptyItem : emptyItem
  const [selectedItem, setSelectedItem] = useState(item ? item : emptyListItem)
  const [itemList, setItemList] = useState<ItemListOption[]>([emptyListItem])
  const [loadingItemList, setLoadingItemList] = useState(false)
  const [unsavedChangesDialogOpen, setUnsavedChangesDialogOpen] = useState<boolean>(false)
  const [areYouSureToDeleteDialogOpen, setAreYouSureToDeleteDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => controller.abort())
    }
  }, [])

  useEffect(() => {
    fetchItemList()
  }, [authState])

  const onSelectItem = async (event: React.SyntheticEvent, selected: ItemListOption | null | string) => {
    selectItem(selected)
  }

  const selectItem = async (selected: ItemListOption | null | string) => {
    if (selected && typeof selected !== 'string' && selected.id) {
      navigate(`/stats/item/${selected.id}`)
      setItemId(selected.id)
    }

    setSelectedItem(selectedItem)
  }

  const internalSetItem = (update: UpdateParam<ItemDTO | null>) => {
    let parsedValue = update instanceof Function ? update(item) : update
    if (parsedValue?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || (parsedValue && !authState.loggedIn)) {
      parsedValue = parsedValue.clone({ id: uuid() })
      setItem(parsedValue)
      navigate(`/stats/item/`)
    } else {
      setItem(parsedValue || null)
    }
  }

  const fetchItemList = () => {
    const fetchData = async () => {
      if (!loadingItemList && authState.user) {
        setLoadingItemList(true)
        const controller = new AbortController()
        controllersRef.current.push(controller)
        const items = (await itemRepository.getAllForUser(authState.user.id, { signal: controller.signal })).map(itemToItemListOption)
        const newItemList = [emptyListItem, ...items]
        setItemList(newItemList)
        setLoadingItemList(false)
      }
    }

    fetchData().catch((error) => {
      setLoadingItemList(false)
      console.error(error)
    })
  }

  const onDrop = ({ removedIndex, addedIndex }: { removedIndex: any; addedIndex: any }) => {
    internalSetItem((_item) => {
      if (_item) {
        return _item?.clone({
          features: arrayMoveImmutable(_item.features, removedIndex, addedIndex)
        })
      }
    })
  }

  const onChange = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
    const { value } = event.target
    internalSetItem((_item) => {
      if (_item) {
        return _item.clone({ [name]: value })
      }
    })
  }

  const onAddFeature = () => {
    internalSetItem((_item) => {
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
    internalSetItem((_item) => {
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
    internalSetItem((_item) => {
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
    internalSetItem((_item) => {
      if (_item) {
        const featuresCopy = [..._item.features]
        featuresCopy.splice(index, 1)
        return _item.clone({ features: featuresCopy })
      }
    })
  }

  const onDeleteImage = () => {
    internalSetItem((_item) => {
      return _item?.clone({ imageId: null })
    })
    setImage(null)
    if (!authState.loggedIn) {
      navigate(`/stats/item/`)
    }
  }

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = (event.target.files || [])[0]

    if (item && imageFile) {
      const itemToSave = item.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? item.clone({ id: uuid() }) : item.clone()
      var reader = new FileReader()

      reader.onload = (event) => {
        if (event && event.target) {
          const imageBase64 = (event.target.result || '') as string

          setImage((_image) => {
            const now = unixtimeNow()
            const newImage = new ImageDTO({
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
                ownerId: itemToSave.id,
                ownerType: EntityType.ITEM
              },
              base64: imageBase64
            }).parseForSaving(imageBase64)
            // upload new image with associated item also to the backend, if successful, set the persisted image to the frontend atom
            if (authState.loggedIn) {
              const controller = new AbortController()
              controllersRef.current.push(controller)
              itemRepository
                .save(itemToSave.toUpdateRequestItemJSON(), newImage, { signal: controller.signal })
                .then((itemSaveResponse) => {
                  const newItemDTO = new ItemDTO(itemSaveResponse.item)
                  setItem(newItemDTO)
                  setPersistedItem(newItemDTO)
                  setImage(itemSaveResponse.image ? new ImageDTO(itemSaveResponse.image) : null)
                  setItemList((_itemList) => [..._itemList, itemToItemListOption(itemSaveResponse.item)])
                })
                .catch((error) => {
                  setImage(newImage ? new ImageDTO(newImage) : null)
                  setError(error)
                })
            } else {
              const newImageDTO = new ImageDTO(newImage)
              setItem(itemToSave.clone({ id: uuid(), imageId: newImageDTO.id }))
              navigate(`/stats/item/`)
              return newImageDTO
            }
          })
        }
      }

      reader.readAsDataURL(imageFile)
    }
  }

  const onDelete = () => {
    setAreYouSureToDeleteDialogOpen(true)
  }

  const onCreateNew = () => {
    const unsavedChanged = !item?.isEqual(persistedItem) && item?.id !== ITEM_DEFAULTS.DEFAULT_ITEM_ID

    if (unsavedChanged) {
      setUnsavedChangesDialogOpen(true)
    } else {
      newItem()
    }
  }

  const newItem = () => {
    const newItemId = uuid()
    const newItem = newItemDTO.clone({ createdBy: authState.user?.id, source: authState.loggedIn ? Source.MyItem : Source.HomeBrew })
    setItemList((_itemList) => {
      return [..._itemList, itemToItemListOption(newItem)]
    })
    setItem(newItem)
    setImage(null)
    navigate(`/stats/item/${newItemId}`)
  }

  const onSave = (callback?: () => void) => {
    if (item) {
      const newItem = item.clone({ ...(item.id === ITEM_DEFAULTS.NEW_ITEM_ID ? { id: uuid() } : {}) })

      if (errorState) {
        setError(null)
      }
      setItem(newItem)
      if (authState.loggedIn && authState.user) {
        const controller = new AbortController()
        controllersRef.current.push(controller)
        itemRepository
          .save(newItem.toUpdateRequestItemJSON(), image?.parseForSaving(image.base64), { signal: controller.signal })
          .then((itemSaveResponse) => {
            const itemDTO = new ItemDTO(itemSaveResponse.item)
            setPersistedItem(itemDTO)
            setItem(itemDTO)
            setImage(itemSaveResponse.image ? new ImageDTO(itemSaveResponse.image) : null)
            fetchItemList()
          })
          .catch((error) => {
            setError(error)
          })
          .finally(() => {
            if (callback) {
              callback()
            }
          })
      }
    }
  }

  const closeUnsavedChangesDialog = (saveChanges?: boolean, createNew?: boolean) => {
    if (saveChanges) {
      onSave(createNew ? newItem : undefined)
    } else if (createNew === true) {
      newItem()
    }
    setUnsavedChangesDialogOpen(false)
  }

  const closeAreYouSureToDeleteDialog = (confirmDeleteItem?: boolean) => {
    if (confirmDeleteItem) {
      deleteItem()
    }
    setAreYouSureToDeleteDialogOpen(false)
  }

  const deleteItem = () => {
    if (authState.loggedIn && authState.user && item) {
      itemRepository
        .delete(item.id)
        .then((deletedItem) => {
          navigate(`/stats/item/`)
          setItemList((_itemList) => {
            return _.filter(_itemList, (item) => item.id !== deletedItem.id)
          })
          selectItem(itemList[0])
        })
        .catch((error) => {
          setError(error)
        })
    }
  }

  const onToggleScreenshotMode = () => {
    if (setScreenshotMode) {
      setScreenshotMode((_screenshotMode) => !_screenshotMode)
    }
  }

  if (item === null) {
    return null
  }

  const itemListHasCurrentItem = _.find(itemList, { id: item.id })
  const autoCompleteSelectedValue = itemListHasCurrentItem ? { id: item.id, name: item.name, source: item.source } : emptyListItem

  const canDeleteItem = item?.id !== ITEM_DEFAULTS.DEFAULT_ITEM_ID && item?.id === 'newItem' && item.createdBy !== authState.user?.id
  const canSaveItem = !item?.isEqual(persistedItem) && item?.id !== ITEM_DEFAULTS.DEFAULT_ITEM_ID

  //console.log('item', item.toJSON())
  //console.log('persistedItem', persistedItem?.toJSON())

  return (
    <StatsInputContainer className={classes.statsInputContainer}>
      {authState.loggedIn ? (
        <div style={{ display: 'flex', justifyContent: isLarge ? 'flex-start' : 'space-between', flexWrap: 'wrap', gap: '1em' }}>
          <div
            style={{
              flex: '0 0 30%'
            }}
          >
            <Autocomplete
              id={`add-item-dropdown`}
              blurOnSelect
              clearOnBlur
              fullWidth
              disableClearable
              groupBy={(option) => option.source}
              value={autoCompleteSelectedValue}
              isOptionEqualToValue={(option, value) => option.id.toLowerCase() === value.id.toLowerCase()}
              loading={loadingItemList}
              options={itemList.sort((a, b) => b.source.localeCompare(a.source))}
              onChange={onSelectItem}
              getOptionLabel={(option) => (typeof option !== 'string' ? option?.name : '')}
              PaperComponent={AutoCompleteItem}
              filterOptions={(options, state) => {
                const displayOptions = options.filter((option) => option.id)

                return displayOptions
              }}
              renderGroup={(params) => (
                <li key={params.key}>
                  <AutocompleteGroupHeader>{params.group.replaceAll('_', ' ')}</AutocompleteGroupHeader>
                  <AutocompleteGroupItems>{params.children}</AutocompleteGroupItems>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Item"
                  variant="filled"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingItemList ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    )
                  }}
                />
              )}
              sx={{
                minWidth: '16em'
              }}
            />
          </div>
          <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1em' }}>
            <Tooltip title="Toggle screenshot mode" placement="top-end">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ScreenshotButton
                  onClick={onToggleScreenshotMode}
                  color={screenshotMode ? 'secondary' : 'default'}
                  sx={{ paddingBottom: 0 }}
                />
                <Switch onClick={onToggleScreenshotMode} checked={screenshotMode} sx={{ marginTop: '-10px' }} color="secondary" />
              </div>
            </Tooltip>
            <Tooltip title={canDeleteItem ? 'Delete item' : ''} placement="top-end">
              <div>
                {/*const canDeleteItem = item?.id !== ITEM_DEFAULTS.DEFAULT_ITEM_ID && item?.id === 'newItem' && item.createdBy !== authState.user?.id*/}
                <DeleteButton onClick={onDelete} Icon={DeleteForeverIcon} disabled={!canDeleteItem} />
              </div>
            </Tooltip>
            <Tooltip title={canSaveItem ? 'Save item' : ''} placement="top-end">
              <div>
                <SaveButton onClick={() => onSave()} disabled={!canSaveItem} />
              </div>
            </Tooltip>
            <Tooltip title="New item" placement="top-end">
              <div>
                <PlusButton onClick={onCreateNew} />
              </div>
            </Tooltip>
          </div>
          <Dialog open={unsavedChangesDialogOpen} onClose={() => closeUnsavedChangesDialog()} PaperProps={{ sx: { padding: '0.5em' } }}>
            <DialogTitle id={`unsaved-changes`} sx={{ fontWeight: 'bold' }}>{`Unsaved changes`}</DialogTitle>
            <DialogContent>
              <Typography variant="body2" paragraph={false}>
                Are you sure you want to create a new item?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginRight: '6em' }}>
                <Button variant="outlined" color="secondary" onClick={() => closeUnsavedChangesDialog()}>
                  Cancel
                </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '0.5em' }}>
                <Button variant="outlined" color="warning" onClick={() => closeUnsavedChangesDialog(false, true)}>
                  Discard changes and create
                </Button>
                <Button variant="outlined" color="success" onClick={() => closeUnsavedChangesDialog(true, true)}>
                  Save changes and create
                </Button>
              </div>
            </DialogActions>
          </Dialog>
          <Dialog
            open={areYouSureToDeleteDialogOpen}
            onClose={() => closeAreYouSureToDeleteDialog()}
            PaperProps={{ sx: { padding: '0.5em' } }}
          >
            <DialogTitle id={`are-you-sure-to-delete`} sx={{ fontWeight: 'bold' }}>{`Are you sure`}</DialogTitle>
            <DialogContent>
              <Typography variant="body2" paragraph={false}>
                Are you sure you want to delete <strong>{item?.name}</strong>
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginRight: '6em' }}>
                <Button variant="outlined" color="secondary" onClick={() => closeAreYouSureToDeleteDialog()}>
                  Cancel
                </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '0.5em' }}>
                <Button variant="outlined" color="error" onClick={() => closeAreYouSureToDeleteDialog(true)}>
                  Yes, delete
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1em' }}>
          <Tooltip title="Toggle screenshot mode" placement="top-end">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <ScreenshotButton
                onClick={onToggleScreenshotMode}
                color={screenshotMode ? 'secondary' : 'default'}
                sx={{ paddingBottom: 0 }}
              />
              <Switch onClick={onToggleScreenshotMode} checked={screenshotMode} sx={{ marginTop: '-10px' }} color="secondary" />
            </div>
          </Tooltip>
        </div>
      )}

      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />

      {authState.loggedIn && (
        <FormControl sx={{ width: '14em', m: 0, flex: '0 0 auto' }} size="small">
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={onAddFeature}>
          Add feature
        </Button>
      </div>
    </StatsInputContainer>
  )
}

export default ItemStatsInput
