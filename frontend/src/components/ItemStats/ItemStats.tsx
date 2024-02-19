import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'

import useStyles from './ItemStats.styles'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography
} from '@mui/material'
import { useAtom } from 'jotai'
import { UpdateParam } from 'state/itemAtom'
import { uuid } from '@dmtool/common'
import { ItemListOption, emptyItem } from 'domain/entities/Item'
import { AutoCompleteItem } from 'components/AutocompleteItem/AutocompleteItem'
import { FrontendItemRepositoryInterface } from 'infrastructure/repositories/ItemRepository'
import { ITEM_DEFAULTS, ImageDTO, ItemDTO } from '@dmtool/application'
import { useNavigate } from 'react-router-dom'
import ItemCard from 'components/ItemCard'
import { newItemDTO } from 'services/defaults'

interface ItemStatsProps {
  item: ItemDTO | null
  persistedItem: ItemDTO | null
  setPersistedItem: React.Dispatch<React.SetStateAction<ItemDTO | null>>
  setItem: (update: UpdateParam<ItemDTO | null>) => void
  setItemId: React.Dispatch<React.SetStateAction<string>>
  setImage: (update: UpdateParam<ImageDTO | null | undefined>) => void
  itemRepository: FrontendItemRepositoryInterface
  image?: ImageDTO | null
  loadingItem: boolean
  loadingImage: boolean
}

export const ItemStats: React.FC<ItemStatsProps> = ({
  item,
  persistedItem,
  setPersistedItem,
  setItem,
  setItemId,
  loadingItem,
  itemRepository,
  setImage,
  image,
  loadingImage
}) => {
  const controllersRef = useRef<AbortController[]>([])

  const { classes } = useStyles()
  const [inlineFeatures, setInlineFeatures] = useState(false)
  const [itemList, setItemList] = useState<ItemListOption[]>([emptyItem] as ItemListOption[])
  const [selectedItem, setSelectedItem] = useState(emptyItem)
  const [loadingItemList, setLoadingItemList] = useState(false)
  const [errorState, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const [authState] = useAtom(authAtom)
  const navigate = useNavigate()

  const [unsavedChangesDialogOpen, setUnsavedChangesDialogOpen] = useState<boolean>(false)

  const fetchItemList = () => {
    const fetchData = async () => {
      if (!loadingItemList && authState.user) {
        setLoadingItemList(true)
        const controller = new AbortController()
        controllersRef.current.push(controller)
        const items = (await itemRepository.getAllForUser(authState.user.id, { signal: controller.signal })).map((item) => {
          return {
            id: item.id,
            name: item.name,
            source: item.source
          }
        })
        const newItemList = [emptyItem, ...items]
        setItemList(newItemList)
        setLoadingItemList(false)
      }
    }

    fetchData().catch((error) => {
      setLoadingItemList(false)
      console.error(error)
    })
  }

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => controller.abort())
    }
  }, [])

  useEffect(() => {
    fetchItemList()
  }, [authState])

  const onSelectItem = async (event: React.SyntheticEvent, selected: ItemListOption | null | string) => {
    if (selected && typeof selected !== 'string' && selected.id) {
      navigate(`/stats/item/${selected.id}`)
      setItemId(selected.id)
    }

    setSelectedItem(selectedItem)
  }

  const onChangeInlineFeatures = () => {
    setInlineFeatures((_inlineFeatures) => !_inlineFeatures)
  }

  const newItem = () => {
    const newItemId = uuid()
    setItem(newItemDTO.clone({ createdBy: authState.user?.id }))
    setImage(null)
    navigate(`/stats/item/${newItemId}`)
  }

  const onDelete = () => {
    if (authState.loggedIn && authState.user && item) {
      itemRepository
        .delete(item.id)
        .then((deletedItem) => {
          navigate(`/stats/item/`)
          setItemList((_itemList) => {
            return _.filter(_itemList, (item) => item.id !== deletedItem.id)
          })
        })
        .catch((error) => {
          setError(error)
        })
    }
  }

  const onCreateNew = () => {
    const unsavedChanged = !item?.isEqual(persistedItem) && item?.id !== ITEM_DEFAULTS.DEFAULT_ITEM_ID

    if (unsavedChanged) {
      setUnsavedChangesDialogOpen(true)
    } else {
      newItem()
    }
  }

  const onSave = (callback?: () => void) => {
    if (item) {
      const newItem = item.clone()
      const itemsWithSameNameCount = itemList.filter((_item) => _item?.name === newItem.name && _item.id !== newItem.id).length
      if (itemsWithSameNameCount > 0) {
        newItem.name = `${newItem.name} #${itemsWithSameNameCount + 1}`
      }
      if (errorState) {
        setError(null)
      }
      setItem(newItem)
      if (authState.loggedIn && authState.user) {
        const controller = new AbortController()
        controllersRef.current.push(controller)
        itemRepository
          .save(newItem, image?.parseForSaving(image.base64), { signal: controller.signal })
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

  return (
    <>
      <Box style={{ display: 'flex', gap: '1em' }}>
        <ItemCard item={item} loadingItem={loadingItem} image={image} loadingImage={loadingImage} inlineFeatures={inlineFeatures} />
        {authState.loggedIn && (
          <div
            style={{
              flex: '1 0 20%'
            }}
          >
            <Autocomplete
              id={`add-item-dropdown`}
              blurOnSelect
              clearOnBlur
              fullWidth
              disableClearable
              filterSelectedOptions
              groupBy={(option) => option.source}
              className={`${classes.autocomplete}`}
              value={selectedItem}
              isOptionEqualToValue={(option, value) => option.id.toLowerCase() === value.id.toLowerCase()}
              loading={loadingItemList}
              options={itemList.sort((a, b) => b.source.localeCompare(a.source))}
              onChange={onSelectItem}
              getOptionLabel={(option) => (typeof option !== 'string' ? option?.name : '')}
              PaperComponent={AutoCompleteItem}
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
                '&&': {
                  margin: '1.5em 0 0 0'
                }
              }}
            />
          </div>
        )}
      </Box>
      <Box displayPrint="none">
        <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '1em 0 0 0' }}>
          {authState.loggedIn && (
            <div style={{ display: 'flex', gap: '2em' }}>
              <Button
                variant="contained"
                color="error"
                onClick={onDelete}
                disabled={item?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID || persistedItem?.name === 'New Item'}
              >
                Delete Item
              </Button>

              <Button
                variant="contained"
                onClick={() => onSave()}
                disabled={item?.isEqual(persistedItem) || item?.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID}
              >
                Save Item
              </Button>
              <Button variant="contained" onClick={onCreateNew}>
                New Item
              </Button>
            </div>
          )}
          <FormControlLabel
            control={<Checkbox color="secondary" checked={inlineFeatures} onChange={onChangeInlineFeatures} />}
            label="Inline features"
          />
        </FormGroup>
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
      </Box>
    </>
  )
}

export default ItemStats
