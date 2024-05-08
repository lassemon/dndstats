import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  useMediaQuery,
  useTheme,
  FormControlLabel
} from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import TaperedRule from 'components/TaperedRule'
import React, { useEffect, useRef, useState } from 'react'
import { Dice, EntityType, Item, ItemCategory, ItemRarity, Source, Visibility, WeaponProperty } from '@dmtool/domain'
import { UpdateParam } from 'state/itemAtom'
import { unixtimeNow, uuid } from '@dmtool/common'
import { useAtom } from 'jotai'
import { authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import { FrontendItemRepositoryInterface } from 'infrastructure/repositories/ItemRepository'
import { HttpImageRepositoryInterface, ITEM_DEFAULTS, ImageDTO, ItemDTO, isArmor, isWeapon } from '@dmtool/application'
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
import ScreenshotButton from 'components/ScreenshotButton'
import config from 'config'
import AddCardIcon from '@mui/icons-material/AddCard'
import { DamageType } from 'interfaces'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import LayersIcon from '@mui/icons-material/Layers'
import LayersClearIcon from '@mui/icons-material/LayersClear'
import ImageRepository from 'infrastructure/repositories/ImageRepository'

interface CantDeleteReasonOptions {
  isDefaultItem: boolean
  isNewItem: boolean
  isCreatedByCurrentUser: boolean
  createdBy: string
}
const getCantDeleteReason = ({ isDefaultItem, isNewItem, isCreatedByCurrentUser, createdBy }: CantDeleteReasonOptions): string => {
  if (isDefaultItem) {
    return 'Cannot delete system default item'
  } else if (isNewItem) {
    return 'Cannot delete unsaved new item'
  } else if (!isCreatedByCurrentUser) {
    return `Cannot delete ${createdBy} item`
  }

  return ''
}

interface CantSaveReasonOptions {
  isDefaultItem: boolean
  hasChanged: boolean
}
const getCantSaveReason = ({ isDefaultItem, hasChanged }: CantSaveReasonOptions): string => {
  if (isDefaultItem) {
    return 'Cannot modify system default item'
  } else if (!hasChanged) {
    return `No changes to save`
  }

  return ''
}

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: ItemListOption) => option.name,
  trim: true,
  ignoreCase: true
})

const itemToItemListOption = (userId: string | undefined, item: Item | ItemDTO): ItemListOption => {
  return {
    id: item.id,
    name: item.name,
    source: userId === item.createdBy ? Source.MyItem : item.source
  }
}

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const useStyles = makeStyles()((theme) => ({
  statsInputContainer: {
    position: 'relative'
  },
  rowBreak: {
    flexBasis: '100%',
    height: 0
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
  },
  sectionHeader: {
    margin: '1em 0 0.8em 0',
    borderBottom: `1px solid ${theme.status.blood}`,
    width: '100%',
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    color: theme.status.blood,
    fontSize: '1.2em',
    lineHeight: '1.1em',
    letterSpacing: '1px',
    fontVariant: 'small-caps'
  }
}))

interface ItemStatsInputProps {
  item: ItemDTO | null
  backendItem: ItemDTO | null
  setItem: (update: UpdateParam<ItemDTO | null>) => void
  setBackendItem: React.Dispatch<React.SetStateAction<ItemDTO | null>>
  setItemId: React.Dispatch<React.SetStateAction<string | undefined>>
  image?: ImageDTO | null
  setImage: (update: UpdateParam<ImageDTO | null | undefined>) => void
  itemRepository: FrontendItemRepositoryInterface
  imageRepository: HttpImageRepositoryInterface
  showSecondaryCategories: boolean
  setShowSecondaryCategories: React.Dispatch<React.SetStateAction<boolean>>
  screenshotMode?: boolean
  setScreenshotMode?: React.Dispatch<React.SetStateAction<boolean>>
}

export const ItemStatsInput: React.FC<ItemStatsInputProps> = ({
  item,
  backendItem,
  setItem,
  setBackendItem,
  setItemId,
  itemRepository,
  imageRepository,
  image,
  setImage,
  screenshotMode,
  setScreenshotMode,
  showSecondaryCategories,
  setShowSecondaryCategories
}) => {
  const controllersRef = useRef<AbortController[]>([])
  const { classes } = useStyles()
  const [errorState, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const navigate = useNavigate()

  const [savingItem, setSavingItem] = useState<boolean>(false)

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
      navigate(`${config.cardPageRoot}/item/${selected.id}`)
      setItemId(selected.id)
    }

    setSelectedItem(selectedItem)
  }

  const internalSetItem = (update: UpdateParam<ItemDTO | null>) => {
    let parsedValue = update instanceof Function ? update(item) : update
    if (parsedValue?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || (parsedValue && !authState.loggedIn)) {
      setItem(parsedValue.clone({ id: uuid(), source: Source.HomeBrew }))
    } else {
      setItem(parsedValue?.clone({ source: Source.HomeBrew }) || null)
    }
  }

  const fetchItemList = () => {
    const fetchData = async () => {
      if (!loadingItemList) {
        setLoadingItemList(true)
        const controller = new AbortController()
        controllersRef.current.push(controller)
        const itemsResponse = await itemRepository.getAll({ signal: controller.signal })
        let items = itemsResponse.items.map(_.partial(itemToItemListOption, authState.user?.id))
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
        return _item.clone({ [name]: String(value) })
      }
    })
  }

  const onChangeRequiresAttunement = () => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.requiresAttunement = !itemClone.requiresAttunement
        return itemClone
      }
    })
  }

  const onChangeAttunementQualifier = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
    const { value } = event.target
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.attunementQualifier = value
        return itemClone
      }
    })
  }

  const onChangePrice = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
    const { value } = event.target
    internalSetItem((_item) => {
      if (_item) {
        return _item.clone({ price: { ..._item.price, ...{ [name]: String(value) } } })
      }
    })
  }

  const onChangeArmorClassBase = (event: SelectChangeEvent<string>) => {
    const { value } = event.target
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.baseArmorClass = value ? String(value) : ''
        return itemClone
      }
    })
  }

  const onChangeArmorClassDexterityBonus = () => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.armorClassDexterityBonus = !itemClone.armorClassDexterityBonus
        return itemClone
      }
    })
  }

  const onChangeArmorClassMaximumBonus = (event: React.ChangeEvent<HTMLInputElement>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.armorClassMaxBonus = event.target.value ?? null
        return itemClone
      }
    })
  }

  const onChangeStealthDisadvantage = () => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.stealthDisadvantage = !itemClone.stealthDisadvantage
        return itemClone
      }
    })
  }

  const onChangeStrengthMinimum = (event: SelectChangeEvent<string>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.strengthMinimum = String(event.target.value) ?? ''
        return itemClone
      }
    })
  }

  const onChangeDamageDiceAmount = (event: SelectChangeEvent<string>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.damageDiceAmount = String(event.target.value)
        return itemClone
      }
    })
  }

  const onChangeDamageDice = (event: SelectChangeEvent<string>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        if (typeof event.target.value === 'string') {
          itemClone.damageDice = event.target.value
        }
        return itemClone
      }
    })
  }

  const onChangeDamageType = (event: SelectChangeEvent<string>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        if (itemClone.damage !== null) {
          itemClone.damage.damageType = event.target.value || ''
        }
        return itemClone
      }
    })
  }

  const onChangeDamageQualifier = (event: React.ChangeEvent<HTMLInputElement>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        if (itemClone.damage !== null) {
          itemClone.damage.qualifier = event.target.value || ''
        }
        return itemClone
      }
    })
  }

  const onChangeTwoHandedDiceAmount = (event: SelectChangeEvent<string>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        itemClone.twoHandedDiceAmount = String(event.target.value)
        return itemClone
      }
    })
  }

  const onChangeTwoHandedDice = (event: SelectChangeEvent<string>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        if (typeof event.target.value === 'string') {
          itemClone.twoHandedDice = event.target.value
        }
        return itemClone
      }
    })
  }

  const onChangeTwoHandedDamageType = (event: SelectChangeEvent<string>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        if (itemClone.twoHandedDamage !== null) {
          itemClone.twoHandedDamage.damageType = event.target.value || ''
        }
        return itemClone
      }
    })
  }

  const onChangeTwoHandedDamageQualifier = (event: React.ChangeEvent<HTMLInputElement>) => {
    internalSetItem((_item) => {
      if (_item) {
        const itemClone = _item.clone()
        if (itemClone.twoHandedDamage !== null) {
          itemClone.twoHandedDamage.qualifier = event.target.value || ''
        }
        return itemClone
      }
    })
  }

  const onChangeThrowRange = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
    const { value } = event.target
    internalSetItem((_item) => {
      if (_item) {
        return _item.clone({ throwRange: { ...(_item.throwRange || { normal: '' }), ...{ [name]: String(value) } } })
      }
    })
  }

  const onChangeUseRange = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
    const { value } = event.target
    internalSetItem((_item) => {
      if (_item) {
        return _item.clone({ useRange: { ...(_item.useRange || { normal: '' }), ...{ [name]: String(value) } } })
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

  const onChangeCategories = (newCategories: ItemCategory[]) => {
    internalSetItem((_item) => {
      if (_item) {
        return _item.clone({ categories: newCategories })
      }
    })
  }

  const onChangeWeaponProperties = (event: React.SyntheticEvent<Element, Event>, newPropertyList: WeaponProperty[]) => {
    internalSetItem((_item) => {
      if (_item) {
        return _item.clone({ properties: newPropertyList })
      }
    })
  }

  const onDeleteImage = () => {
    internalSetItem((_item) => {
      if (_item && _item.imageId && authState.loggedIn) {
        imageRepository.delete(_item.id)
      }
      return _item?.clone({ imageId: null })
    })
    setImage(null)
    if (!authState.loggedIn) {
      navigate(`${config.cardPageRoot}/item/`)
    }
  }

  const onUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = (event.target.files || [])[0]

    if (item && imageFile) {
      const shouldGenerateNewId = item.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || item.id === ITEM_DEFAULTS.NEW_ITEM_ID
      const itemToSave = shouldGenerateNewId ? item.clone({ id: uuid() }) : item.clone()
      const reader = new FileReader()

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
              setSavingItem(true)
              itemRepository
                .save(itemToSave.toUpdateRequestItemJSON(), newImage, { signal: controller.signal })
                .then((itemSaveResponse) => {
                  setItem(new ItemDTO(itemSaveResponse.item))
                  setBackendItem(new ItemDTO(itemSaveResponse.item))
                  setImage(itemSaveResponse.image ? new ImageDTO(itemSaveResponse.image) : null)
                  setItemList((_itemList) => _.unionBy(_itemList, [itemToItemListOption(authState.user?.id, itemSaveResponse.item)], 'id'))
                })
                .catch((error) => {
                  setImage(newImage ? new ImageDTO(newImage) : null)
                  setError(error)
                })
                .finally(() => {
                  setSavingItem(false)
                })
            } else {
              const newImageDTO = new ImageDTO(newImage)
              setItem(itemToSave.clone({ id: uuid(), imageId: newImageDTO.id }))
              navigate(`${config.cardPageRoot}/item/`)
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
    const unsavedChanged = !item?.isEqual(backendItem) && item?.id !== ITEM_DEFAULTS.DEFAULT_ITEM_ID

    if (unsavedChanged) {
      setUnsavedChangesDialogOpen(true)
    } else {
      newItem()
    }
  }

  const newItem = () => {
    const newItemId = uuid()
    const newItem = newItemDTO.clone({
      createdBy: authState.user?.id,
      source: authState.loggedIn ? Source.MyItem : Source.HomeBrew,
      updatedAt: unixtimeNow()
    })
    setItem(newItem)
    setImage(null)
    navigate(`${config.cardPageRoot}/item/${newItemId}`)
  }

  const onSave = (_item: ItemDTO | null, callback?: () => void) => {
    if (_item) {
      const newItem = _item.clone({ ...(_item.id === ITEM_DEFAULTS.NEW_ITEM_ID ? { id: uuid() } : {}) })

      if (errorState) {
        setError(null)
      }
      setItem(newItem)
      if (authState.loggedIn && authState.user) {
        const controller = new AbortController()
        controllersRef.current.push(controller)
        setSavingItem(true)
        itemRepository
          .save(newItem.toUpdateRequestItemJSON(), image?.parseForSaving(image.base64), { signal: controller.signal })
          .then((itemSaveResponse) => {
            setBackendItem(new ItemDTO(itemSaveResponse.item))
            setItem(new ItemDTO(itemSaveResponse.item))
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
            setSavingItem(false)
          })
      }
    }
  }

  const onSaveAs = () => {
    onSave(item?.clone({ id: uuid() }) || null)
  }

  const closeUnsavedChangesDialog = (saveChanges?: boolean, createNew?: boolean) => {
    if (saveChanges) {
      onSave(item, createNew ? newItem : undefined)
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
      setSavingItem(true)
      itemRepository
        .delete(item.id)
        .then((deletedItem) => {
          navigate(`${config.cardPageRoot}/item/`)
          setItemList((_itemList) => {
            return _.filter(_itemList, (item) => item.id !== deletedItem.id)
          })
          selectItem(itemList[0])
        })
        .catch((error) => {
          setError(error)
        })
        .finally(() => {
          setSavingItem(false)
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

  const isDefaultItem = item?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID
  const isNewItem = item?.id === 'newItem'
  const isCreatedByCurrentUser = item.createdBy === authState.user?.id
  const hasChanged = !item?.isEqual(backendItem)
  const isNewItemForUser = hasChanged && !isCreatedByCurrentUser

  const canDelete = {
    reason: getCantDeleteReason({ isDefaultItem, isNewItem, isCreatedByCurrentUser, createdBy: item.createdByUserName }),
    status: !isDefaultItem && !isNewItem && isCreatedByCurrentUser
  }

  const canSave = {
    reason: getCantSaveReason({ hasChanged, isDefaultItem }),
    status: hasChanged && !isDefaultItem
  }

  const isCreatingItem = canSave.status && isNewItemForUser
  let canSaveTooltip = canSave.status ? 'Save item' : canSave.reason
  if (isCreatingItem) {
    canSaveTooltip = 'Create item'
  }

  return (
    <StatsInputContainer className={classes.statsInputContainer}>
      <div style={{ display: 'flex', justifyContent: isLarge ? 'flex-start' : 'space-between', flexWrap: 'wrap', gap: '1em' }}>
        <div
          style={{
            flex: `0 0 ${isLarge ? '100%' : '30%'}`
          }}
        >
          <Autocomplete
            id={`select-item-dropdown`}
            blurOnSelect
            selectOnFocus
            clearOnBlur
            fullWidth
            groupBy={(option) => option.source}
            value={autoCompleteSelectedValue}
            isOptionEqualToValue={(option, value) => option.id.toLowerCase() === value.id.toLowerCase()}
            loading={loadingItemList}
            options={itemList.sort((a, b) => b.source.localeCompare(a.source))}
            onChange={onSelectItem}
            getOptionLabel={(option) => (typeof option !== 'string' ? option?.name : '')}
            PaperComponent={AutoCompleteItem}
            filterOptions={(list, state) =>
              filterOptions(
                list.filter((option) => option.id),
                state
              )
            }
            renderGroup={(params) => {
              return (
                <li key={params.key}>
                  <AutocompleteGroupHeader>{params.group.replaceAll('_', ' ')}</AutocompleteGroupHeader>
                  <AutocompleteGroupItems>{params.children}</AutocompleteGroupItems>
                </li>
              )
            }}
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
              width: isLarge ? '100%' : '16em'
            }}
          />
        </div>
        {authState.loggedIn ? (
          <>
            <div
              style={{
                flex: '1 1 auto',
                display: 'flex',
                justifyContent: isLarge ? 'flex-start' : 'flex-end',
                alignItems: 'center',
                gap: '0.2em'
              }}
            >
              <Tooltip
                title={showSecondaryCategories ? 'Hide secondary categories' : 'Show secondary categories'}
                placement="top-start"
                disableInteractive
              >
                <IconButton
                  color={showSecondaryCategories ? 'secondary' : 'default'}
                  onClick={() => setShowSecondaryCategories(!showSecondaryCategories)}
                >
                  {showSecondaryCategories ? <LayersIcon /> : <LayersClearIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle screenshot mode" placement="top-start" disableInteractive>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <ScreenshotButton
                    onClick={onToggleScreenshotMode}
                    color={screenshotMode ? 'secondary' : 'default'}
                    sx={{ paddingBottom: 0 }}
                  />
                  <Switch onClick={onToggleScreenshotMode} checked={screenshotMode} sx={{ marginTop: '-10px' }} color="secondary" />
                </div>
              </Tooltip>
              <Tooltip title={canDelete.status ? 'Delete item' : canDelete.reason} placement="top-start" disableInteractive>
                <div>
                  <DeleteButton onClick={onDelete} Icon={DeleteForeverIcon} disabled={!canDelete.status || savingItem} />
                </div>
              </Tooltip>
              <Tooltip title={canSaveTooltip} placement="top-start" disableInteractive>
                <div>
                  <SaveButton onClick={() => onSave(item)} disabled={!canSave.status || savingItem} />
                </div>
              </Tooltip>
              <Tooltip title="Save As.. (create new)" placement="top-start" disableInteractive>
                <div>
                  <SaveButton disabled={savingItem} onClick={() => onSaveAs()} Icon={SaveAsIcon} />
                </div>
              </Tooltip>
              <Tooltip title="New blank item" placement="top-start" disableInteractive>
                <div>
                  <IconButton
                    disabled={savingItem}
                    aria-label="plus"
                    sx={{ color: (theme) => theme.palette.secondary.main }}
                    onClick={onCreateNew}
                  >
                    <AddCardIcon fontSize="large" />
                  </IconButton>
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
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1em' }}>
            <Tooltip title="Toggle screenshot mode" placement="top-end" disableInteractive>
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
      </div>

      <ImageButtons onUpload={onUploadImage} onDeleteImage={onDeleteImage} disabled={savingItem} />

      <TextField
        id="item-name"
        label="Name"
        value={item.name}
        onChange={onChange('name')}
        InputLabelProps={{
          shrink: true
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          id="attunement-qualifier"
          label="Attunement Qualifier"
          value={item.attunementQualifier}
          disabled={!item.requiresAttunement}
          onChange={onChangeAttunementQualifier}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Tooltip title="Toggle Requires Attunement" placement="top-start" disableInteractive>
          <div>
            <FormControlLabel
              control={<Switch color="secondary" checked={item.requiresAttunement || false} onClick={onChangeRequiresAttunement} />}
              label="Requires Attunement"
              labelPlacement="top"
              sx={{
                margin: 0,
                minWidth: '10em',
                '& span.MuiTypography-root': {
                  textAlign: 'center',
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.9em'
                }
              }}
            />
          </div>
        </Tooltip>
      </div>

      <TextField
        id="item-short-description"
        label="Short Description"
        value={item.shortDescription || ''}
        onChange={onChange('shortDescription')}
        InputLabelProps={{
          shrink: true
        }}
        sx={{
          width: '34em',
          maxWidth: '95%'
        }}
      />
      <TextField
        id="item-main-description"
        label="Main Description"
        value={item.mainDescription || ''}
        multiline={true}
        onChange={onChange('mainDescription')}
        InputLabelProps={{
          shrink: true
        }}
        sx={{
          width: '34em',
          maxWidth: '95%'
        }}
      />

      <div style={{ display: 'flex', gap: '1em', justifyContent: 'space-between', margin: '1em 0 0 0' }}>
        {authState.loggedIn && (
          <FormControl sx={{ width: '9em', m: 0, flex: '0 0 auto' }} size="small">
            <InputLabel shrink id="visibility">
              Visibility
            </InputLabel>
            <Select
              labelId={'visibility'}
              id="visibility-select"
              value={item.visibility || authState.loggedIn ? Visibility.PRIVATE : Visibility.PUBLIC}
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
        <Autocomplete
          multiple
          clearOnBlur
          disableCloseOnSelect
          size="small"
          id="category-select"
          limitTags={isLarge ? 3 : 6}
          options={Object.values(ItemCategory).map((category) => category.toString())}
          getOptionLabel={(option) => option.replaceAll('-', ' ')}
          onChange={(_, newCategories) => {
            onChangeCategories(newCategories as ItemCategory[])
          }}
          value={item.categories || []}
          PaperComponent={AutoCompleteItem}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Categories"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
          sx={{
            flex: '1 1 auto'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5em' }}>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <TextField
            id="item-price"
            label="Price"
            value={item?.price?.quantity || ''}
            onChange={onChangePrice('quantity')}
            InputLabelProps={{
              shrink: true
            }}
            sx={{
              width: '6em'
            }}
          />
          <Select
            size="small"
            value={item?.price?.unit || 'gp'}
            onChange={onChangePrice('unit')}
            sx={{ '&& .MuiSelect-select': { textTransform: 'lowercase' } }}
          >
            <MenuItem value="cp" sx={{ textTransform: 'lowercase' }}>
              cp
            </MenuItem>
            <MenuItem value="sp" sx={{ textTransform: 'lowercase' }}>
              sp
            </MenuItem>
            <MenuItem value="ep" sx={{ textTransform: 'lowercase' }}>
              ep
            </MenuItem>
            <MenuItem value="gp" sx={{ textTransform: 'lowercase' }}>
              gp
            </MenuItem>
            <MenuItem value="pp" sx={{ textTransform: 'lowercase' }}>
              pp
            </MenuItem>
          </Select>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3em' }}>
          <Typography variant="caption" sx={{ flex: '1 1 100%', color: (theme) => theme.palette.grey[700] }}>
            Use Range
          </Typography>
          <TextField
            id="item-userange-normal"
            label="Normal"
            type="number"
            value={item.useRangeNormal || ''}
            onChange={onChangeUseRange('normal')}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">ft.</InputAdornment>
            }}
            sx={{
              margin: '0 1.6em 0 1em',
              width: '4em'
            }}
          />
          <TextField
            id="item-userange-long"
            label="Long"
            type="number"
            value={item.useRangeLong || ''}
            onChange={onChangeUseRange('long')}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">ft.</InputAdornment>
            }}
            sx={{
              width: '4em'
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            gap: '1em',
            alignItems: 'end',
            flex: isLarge ? '1 1 auto' : ''
          }}
        >
          <TextField
            id="item-weight"
            label="Weight"
            type="number"
            value={item.weight || ''}
            onChange={onChange('weight')}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">lb.</InputAdornment>
            }}
            sx={{
              width: '5em'
            }}
          />
          <FormControl size="small" sx={{ width: 'auto' }}>
            <InputLabel shrink id="rarity">
              Rarity
            </InputLabel>
            <Select
              labelId={'rarity'}
              id="rarity-select"
              value={item.rarity || ''}
              label="Rarity"
              onChange={onChange('rarity')}
              sx={{
                width: '12em'
              }}
            >
              <MenuItem value="" sx={{ fontStyle: 'italic' }}>
                None
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
      </div>

      <Tooltip
        title={!isArmor(item) ? 'The item must be part of an armor category before you can assign an armor properties to it.' : ''}
        placement="top-start"
        disableInteractive
      >
        <div>
          <h3 className={classes.sectionHeader} style={{ opacity: isArmor(item) ? '1' : '0.3' }}>
            Armor Properties
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', margin: '0' }}>
            <FormControl sx={{ width: '7em', m: 0, flex: '0 0 auto', margin: '0 1em 0 0' }} size="small" disabled={!isArmor(item)}>
              <InputLabel shrink id="armorclass">
                Armor Class
              </InputLabel>
              <Select
                displayEmpty
                labelId={'armorClass'}
                id="armorClass-select"
                value={item.armorClass?.base ? String(item.armorClass.base) : ''}
                label="Armor Class"
                onChange={onChangeArmorClassBase}
              >
                <MenuItem key={0} value={''} sx={{ fontStyle: 'italic' }}>
                  None
                </MenuItem>
                {Array.from({ length: 20 }, (_, index) => index + 1).map((value, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      +{value}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>

            <FormControl sx={{ width: '9em', m: 0, flex: '0 0 auto', margin: '0 1em 0 0' }} size="small" disabled={!isArmor(item)}>
              <InputLabel shrink id="strength-minimum">
                Strength Minimum
              </InputLabel>
              <Select
                displayEmpty
                labelId={'strength-minimum'}
                id="strength-minimum-select"
                value={item.strengthMinimum ? String(item.strengthMinimum) : ''}
                label="Strength Minimum"
                onChange={onChangeStrengthMinimum}
              >
                <MenuItem key={0} value={''} sx={{ fontStyle: 'italic' }}>
                  None
                </MenuItem>
                {Array.from({ length: 20 }, (_, index) => index + 1).map((value, index) => {
                  return (
                    <MenuItem key={index} value={String(value)}>
                      {value}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>

            <Tooltip title="Toggle Stealth Disadvantage" placement="top-start" disableInteractive>
              <div>
                <FormControlLabel
                  disabled={!isArmor(item)}
                  control={<Switch color="secondary" checked={item.stealthDisadvantage || false} onClick={onChangeStealthDisadvantage} />}
                  label="Stealth Disadvantage"
                  labelPlacement="top"
                  sx={{
                    margin: 0,
                    minWidth: '10em',
                    '& span.MuiTypography-root': {
                      textAlign: 'center',
                      color: 'rgba(0, 0, 0, 0.6)',
                      fontSize: '0.9em'
                    }
                  }}
                />
              </div>
            </Tooltip>
          </div>
          <div style={{ display: 'flex', gap: '0.5em', margin: '1em 0 0 0' }}>
            <Tooltip title="Toggle Maximum DEX Bonus" placement="top-start" disableInteractive>
              <FormControlLabel
                disabled={!isArmor(item)}
                control={
                  <Switch color="secondary" checked={item.armorClassDexterityBonus || false} onClick={onChangeArmorClassDexterityBonus} />
                }
                label=""
                labelPlacement="top"
                sx={{
                  margin: 0,
                  '& span.MuiTypography-root': {
                    textAlign: 'center',
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.9em'
                  }
                }}
              />
            </Tooltip>

            <TextField
              id="armorClass-maximumBonus"
              label="Maximum DEX Bonus"
              variant="outlined"
              disabled={!isArmor(item) || !item.armorClassDexterityBonus}
              value={item.armorClass?.maximumBonus || ''}
              onChange={onChangeArmorClassMaximumBonus}
              size="small"
              InputLabelProps={{
                shrink: true,
                sx: {
                  '&.Mui-disabled': {
                    opacity: '0.5'
                  }
                }
              }}
              sx={{
                maxWidth: '12em'
              }}
            />
          </div>
        </div>
      </Tooltip>

      <Tooltip
        title={!isWeapon(item) ? 'The item must be part of a weapon category before you can assign weapon properties to it.' : ''}
        placement="top-start"
        disableInteractive
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em', margin: '0' }}>
          <h3 className={classes.sectionHeader} style={{ opacity: isWeapon(item) ? '1' : '0.3' }}>
            Weapon Properties
          </h3>
          <Autocomplete
            multiple
            clearOnBlur
            disableCloseOnSelect
            disabled={!isWeapon(item)}
            value={(item.properties as WeaponProperty[]) || []}
            options={Object.values(WeaponProperty)}
            onChange={onChangeWeaponProperties}
            getOptionLabel={(option) => option.replaceAll('_', ' ')}
            style={{ width: '100%' }}
            PaperComponent={AutoCompleteItem}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Weapon Properties"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true
                }}
              />
            )}
            sx={{ width: '100%' }}
          />

          <div className={classes.rowBreak} />

          <FormControl sx={{ width: '12em', m: 0, flex: '0 0 auto' }} size="small" disabled={!isWeapon(item)}>
            <InputLabel shrink id="damageDiceAmount">
              Damage Dice Amount
            </InputLabel>
            <Select
              displayEmpty
              labelId={'damage dice amount'}
              id="damageDiceAmount-select"
              value={item.damageDiceAmount}
              label="Damage Dice Amount"
              onChange={onChangeDamageDiceAmount}
            >
              <MenuItem key={0} value={''} sx={{ fontStyle: 'italic' }}>
                None
              </MenuItem>
              {Array.from({ length: 20 }, (_, index) => index + 1).map((value, index) => {
                return (
                  <MenuItem key={index + 1} value={String(value)}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '10em', m: 0, flex: '0 0 auto' }} size="small" disabled={!isWeapon(item)}>
            <InputLabel shrink id="damageDice">
              Damage Dice
            </InputLabel>
            <Select
              displayEmpty
              labelId={'damage dice'}
              id="damageDice-select"
              value={item.damageDice}
              label="Damage Dice"
              onChange={onChangeDamageDice}
              sx={{ textTransform: 'initial' }}
            >
              <MenuItem key={0} value={''} sx={{ fontStyle: 'italic' }}>
                None
              </MenuItem>
              {Object.values(Dice).map((value, index) => {
                return (
                  <MenuItem key={index} value={value} sx={{ textTransform: 'initial' }}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <FormControl sx={{ width: '10em', m: 0, flex: '0 0 auto' }} size="small" disabled={!isWeapon(item)}>
            <InputLabel shrink id="damageDice">
              Damage Type
            </InputLabel>
            <Select
              displayEmpty
              labelId={'damage type'}
              id="damageType-select"
              value={item.damage?.damageType || ''}
              label="Damage Type"
              onChange={onChangeDamageType}
              sx={{
                textTransform: 'capitalize'
              }}
            >
              <MenuItem key={0} value={''} sx={{ fontStyle: 'italic' }}>
                None
              </MenuItem>
              {Object.values(DamageType).map((value, index) => {
                return (
                  <MenuItem key={index} value={value} sx={{ textTransform: 'capitalize' }}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <TextField
            id="damage-qualifier"
            label="Damage Qualifier"
            variant="outlined"
            size="small"
            value={item.damage?.qualifier || ''}
            disabled={!isWeapon(item)}
            onChange={onChangeDamageQualifier}
            InputLabelProps={{
              shrink: true
            }}
            sx={{
              width: 'auto'
            }}
          />
        </div>
      </Tooltip>

      <Tooltip
        title={
          !isWeapon(item) || (!item.properties.includes(WeaponProperty.VERSATILE) && !item.properties.includes(WeaponProperty.TWO_HANDED))
            ? 'The item must have the Versatile or Two-Handed property before you can assign two-handed damage to it.'
            : ''
        }
        placement="top-start"
        disableInteractive
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em', margin: '1em 0 0 0' }}>
          <FormControl
            sx={{ width: '13em', m: 0, flex: '0 0 auto' }}
            size="small"
            disabled={
              !isWeapon(item) ||
              (!item.properties.includes(WeaponProperty.VERSATILE) && !item.properties.includes(WeaponProperty.TWO_HANDED))
            }
          >
            <InputLabel shrink id="twoHandedDamageDiceAmount">
              Dice Amount (Two Handed )
            </InputLabel>
            <Select
              displayEmpty
              labelId={'two handed dice amount'}
              id="twoHandedDiceAmount-select"
              value={item.twoHandedDiceAmount}
              label="Dice Amount (Two Handed )"
              onChange={onChangeTwoHandedDiceAmount}
            >
              <MenuItem key={0} value={''} sx={{ fontStyle: 'italic' }}>
                None
              </MenuItem>
              {Array.from({ length: 20 }, (_, index) => index + 1).map((value, index) => {
                return (
                  <MenuItem key={index} value={String(value)}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <FormControl
            sx={{ width: '13em', m: 0, flex: '0 0 auto' }}
            size="small"
            disabled={
              !isWeapon(item) ||
              (!item.properties.includes(WeaponProperty.VERSATILE) && !item.properties.includes(WeaponProperty.TWO_HANDED))
            }
          >
            <InputLabel shrink id="twoHandedDamageDice">
              Damage Dice (Two Handed)
            </InputLabel>
            <Select
              displayEmpty
              labelId={'two handed damage dice'}
              id="twoHandedDice-select"
              value={item.twoHandedDice}
              label="Damage Dice (Two Handed)"
              onChange={onChangeTwoHandedDice}
              sx={{ textTransform: 'initial' }}
            >
              <MenuItem key={0} value={''} sx={{ fontStyle: 'italic' }}>
                None
              </MenuItem>
              {Object.values(Dice).map((value, index) => {
                return (
                  <MenuItem key={index} value={value} sx={{ textTransform: 'initial' }}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <FormControl
            sx={{ width: '13em', m: 0, flex: '0 0 auto' }}
            size="small"
            disabled={
              !isWeapon(item) ||
              (!item.properties.includes(WeaponProperty.VERSATILE) && !item.properties.includes(WeaponProperty.TWO_HANDED))
            }
          >
            <InputLabel shrink id="damageDice">
              Damage Type (Two Handed)
            </InputLabel>
            <Select
              displayEmpty
              labelId={'two handed damage type'}
              id="two-handed-damageType-select"
              value={item.twoHandedDamage?.damageType || ''}
              label="Damage Type (Two Handed)"
              onChange={onChangeTwoHandedDamageType}
              sx={{
                textTransform: 'capitalize'
              }}
            >
              <MenuItem key={0} value={''} sx={{ fontStyle: 'italic' }}>
                None
              </MenuItem>
              {Object.values(DamageType).map((value, index) => {
                return (
                  <MenuItem key={index} value={value} sx={{ textTransform: 'capitalize' }}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <TextField
            id="two-handed-damage-qualifier"
            label="Damage Qualifier (Two Handed)"
            variant="outlined"
            size="small"
            value={item.twoHandedDamage?.qualifier || ''}
            disabled={!isWeapon(item)}
            onChange={onChangeTwoHandedDamageQualifier}
            InputLabelProps={{
              shrink: true
            }}
            sx={{
              width: 'auto'
            }}
          />
        </div>
      </Tooltip>

      <div style={{ display: 'flex', margin: '0 0 1em 0' }}>
        <Tooltip
          title={!item.hasThrownProperty() ? 'Item must have the Thrown property before you can assign throw range to it' : ''}
          placement="top-start"
          disableInteractive
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '.3em',
              opacity: !item.hasThrownProperty() ? '0.5' : '1',
              userSelect: !item.hasThrownProperty() ? 'none' : 'all'
            }}
          >
            <Typography variant="caption" sx={{ flex: '1 1 100%', color: (theme) => theme.palette.grey[700] }}>
              Throw Range
            </Typography>
            <TextField
              id="item-throwrange-normal"
              label="Normal"
              type="number"
              disabled={!item.hasThrownProperty()}
              value={item.throwRangeNormal || ''}
              onChange={onChangeThrowRange('normal')}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">ft.</InputAdornment>
              }}
              sx={{
                margin: '0 1.6em 0 1em',
                width: '4em'
              }}
            />
            <TextField
              id="item-throwrange-long"
              label="Long"
              type="number"
              disabled={!item.hasThrownProperty()}
              value={item.throwRangeLong || ''}
              onChange={onChangeThrowRange('long')}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">ft.</InputAdornment>
              }}
              sx={{
                width: '4em'
              }}
            />
          </div>
        </Tooltip>
      </div>

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
