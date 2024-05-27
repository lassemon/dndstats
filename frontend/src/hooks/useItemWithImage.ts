import {
  BrowserImageProcessingService,
  HttpImageRepositoryInterface,
  HttpItemRepositoryInterface,
  ITEM_DEFAULTS,
  ImageDTO,
  ItemDTO,
  LocalStorageImageRepositoryInterface
} from '@dmtool/application'
import { unixtimeNow } from '@dmtool/common'
import { Source } from '@dmtool/domain'
import { StorageSyncError } from 'domain/errors/StorageError'
import { authAtom, errorAtom } from 'infrastructure/dataAccess/atoms'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import React, { useEffect, useRef, useState } from 'react'
import { UpdateParam, itemAtom } from 'state/itemAtom'
import config from 'config'
import { unstable_batchedUpdates } from 'react-dom'

// FIXME, this whole hook has become too complex to maintain. refactor and separate image fetch from item fetch

const DEBUG = false

const imageProcessingService = new BrowserImageProcessingService()

type UseItemReturn = [
  {
    loadingItem: boolean
    loadingImage: boolean
    item: ItemDTO | null
    image: ImageDTO | null | undefined
    backendItem: ItemDTO | null
    setBackendItem: React.Dispatch<React.SetStateAction<ItemDTO | null>>
    itemError?: any
    imageError?: any
  },
  (update: UpdateParam<ItemDTO | null>) => void,
  (update: UpdateParam<ImageDTO | null | undefined>) => void
]

const localStorageItemAtom = atomWithStorage<ItemDTO | null | undefined>(
  'localItemAtom',
  null,
  {
    getItem: (key, initialValue) => {
      const storedItem = JSON.parse(localStorage.getItem(key) || 'null')
      return storedItem ? new ItemDTO(storedItem) : initialValue
    },
    setItem: (key, newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify({ ...newValue?.toJSON(), source: Source.HomeBrew, updatedAt: unixtimeNow() }))
      }
    },
    removeItem: (key) => {
      localStorage.removeItem(key)
    }
  },
  { getOnInit: true }
)
const localStorageImageAtom = atomWithStorage<ImageDTO | null | undefined>(
  'localImageAtom',
  null,
  {
    getItem: (key, initialValue) => {
      const storedItem = JSON.parse(localStorage.getItem(key) || 'null')
      return storedItem ? new ImageDTO(storedItem) : initialValue
    },
    setItem: (key, newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify({ ...newValue?.toJSON(), source: Source.HomeBrew, updatedAt: unixtimeNow() }))
      }
    },
    removeItem: (key) => {
      localStorage.removeItem(key)
    }
  },
  { getOnInit: true }
)

export interface UseItemWithImageOptions {
  persist?: boolean
  useDefault?: boolean
}

const useItemWithImage = (
  itemRepository: HttpItemRepositoryInterface,
  imageRepository: LocalStorageImageRepositoryInterface | HttpImageRepositoryInterface,
  itemId?: string,
  options: UseItemWithImageOptions = { persist: false, useDefault: true }
): UseItemReturn => {
  const imageRequestControllerRef = useRef<AbortController | null>(null)
  const fetchAndSetImage = async (_imageId: string) => {
    try {
      setIsLoadingImage(true)
      const controller = new AbortController()
      imageRequestControllerRef.current = controller

      DEBUG && console.log('fetching image', _imageId)
      const fetchedImage = await imageRepository.getById(_imageId, { signal: controller.signal })
      DEBUG && console.log('fetched image', fetchedImage)
      unstable_batchedUpdates(() => {
        setIsLoadingImage(false)

        const localStorageImageIsSameAsFetched = fetchedImage.metadata.id === localStorageItem?.id
        const localStorageImageIsNewer = (fetchedImage.metadata?.updatedAt || 0) < (localStorageItem?.updatedAt || -1)
        DEBUG && console.log('localStorageImageIsSameAsFetched', localStorageImageIsSameAsFetched)
        DEBUG && console.log('localStorageImageIsNewer', localStorageImageIsNewer)
        if ((localStorageImageIsSameAsFetched && !localStorageImageIsNewer) || !localStorageImageIsSameAsFetched) {
          setImage(new ImageDTO(fetchedImage))
          setLocalStorageImage(new ImageDTO(fetchedImage))
        }
      })
    } catch (error) {
      unstable_batchedUpdates(() => {
        setIsLoadingImage(false)
        setImageError(error)
      })
    }
  }

  const { persist, useDefault = true } = options
  const [authState] = useAtom(authAtom)

  const itemRequestControllerRef = useRef<AbortController | null>(null)

  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))

  const [item, setItem] = useAtom(itemAtom)
  const [localStorageItem, setLocalStorageItem] = useAtom(localStorageItemAtom)
  const [backendItem, setBackendItem] = useState<ItemDTO | null>(null)

  const [image, setImage] = useState<ImageDTO | null | undefined>(null)
  const [localStorageImage, setLocalStorageImage] = useAtom(localStorageImageAtom)

  const [itemError, setItemError] = useState<any>(null)
  const [imageError, setImageError] = useState<any>(null)
  const [isLoadingItem, setIsLoadingItem] = useState(false)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  let returnItem = (persist === true && localStorageItem ? localStorageItem : item) || null
  let returnImage = (persist === true ? localStorageImage : image) || null
  let imageId = returnItem?.imageId || null

  useEffect(() => {
    DEBUG && console.log('itemId changed =>', itemId)
    const fetchAndSetItem = async (_itemId: string) => {
      try {
        setIsLoadingItem(true)
        const controller = new AbortController()
        itemRequestControllerRef.current = controller
        DEBUG && console.log('getting item by id  =>', _itemId)
        const fetchedItem = await itemRepository.getById(_itemId, { signal: controller.signal })

        unstable_batchedUpdates(() => {
          setIsLoadingItem(false)
          const localStorageItemIsSameAsFetched = fetchedItem.id === localStorageItem?.id && fetchedItem.source === localStorageItem.source
          const localStorageItemIsNewer = (fetchedItem?.updatedAt || 0) < (localStorageItem?.updatedAt || -1)
          setBackendItem(new ItemDTO(fetchedItem))

          DEBUG && console.log('localStorageItemIsSameAsFetched', localStorageItemIsSameAsFetched)
          DEBUG && console.log('localStorageItemIsNewer', localStorageItemIsNewer)

          if ((localStorageItemIsSameAsFetched && !localStorageItemIsNewer) || !localStorageItemIsSameAsFetched) {
            setLocalStorageItem(new ItemDTO({ ...fetchedItem, updatedAt: unixtimeNow() }))
            setItem(new ItemDTO(fetchedItem))

            if (!fetchedItem.imageId) {
              setImage(null)
              setLocalStorageImage(null)
            }
          }
        })
      } catch (error) {
        unstable_batchedUpdates(() => {
          setIsLoadingItem(false)
          setItemError(error)
        })
      }
    }

    const itemIdExists = !!itemId
    const itemIdIsTheSameAsSavedItem = itemId === (persist ? localStorageItem?.id : item?.id)
    const itemExists = !!returnItem
    const isNewItem = itemId === ITEM_DEFAULTS.NEW_ITEM_ID
    const localStorageInvalidated = (localStorageItem?.updatedAt || 0) < unixtimeNow() + config.localStorageInvalidateTimeInMilliseconds

    const shouldFetchItem =
      (itemIdExists && !itemIdIsTheSameAsSavedItem && !isNewItem) ||
      (itemIdExists && !itemExists && !isNewItem) ||
      (authState.loggedIn && itemIdExists && persist && localStorageInvalidated && !isNewItem)

    if (DEBUG) {
      console.log('\n\n\n')
      console.log('itemIdExists', itemIdExists)
      console.log('itemIdIsTheSameAsSavedItem', itemIdIsTheSameAsSavedItem)
      console.log('itemExists', itemExists)
      console.log('authState.loggedIn', authState.loggedIn)
      console.log('persist', persist)
      console.log('localStorageInvalidated', localStorageInvalidated)
      console.log('---')
      console.log('backendItem?.id', backendItem?.id)
      console.log('localStorageItem?.id', localStorageItem?.id)
      console.log('itemId', itemId)
      console.log('isLoadingItem', isLoadingItem)
      console.log('item?.id', item?.id)
      //console.log('local storage item last updated at', dateStringFromUnixTime(localStorageItem?.updatedAt || 0))
      console.log('shouldFetchItem', shouldFetchItem)
      console.log('\n\n\n')

      console.log('returnImage', returnImage)
      console.log('imageId', imageId)
      console.log('\n\n\n')
    }

    if (shouldFetchItem && !isLoadingItem) {
      fetchAndSetItem(itemId)
    } else if (!itemIdExists && !itemExists && useDefault) {
      DEBUG && console.log('fetching default item')
      fetchAndSetItem('defaultItem')
    }

    if (!returnImage && !!imageId && returnItem?.imageId) {
      fetchAndSetImage(returnItem.imageId)
    }
  }, [itemId])

  useEffect(() => {
    const itemIdExists = !!itemId
    const imageIdExists = !!imageId
    const imageIdIsTheSameAsSavedImage = imageId === (persist ? localStorageImage?.id : image?.id)
    const imageExists = persist ? !!localStorageImage : !!image
    const shouldFetchImage = itemIdExists && ((imageIdExists && !imageIdIsTheSameAsSavedImage) || (imageIdExists && !imageExists))

    if (DEBUG) {
      console.log('imageId', imageId)
      console.log('imageIdExists', imageIdExists)
      console.log('imageIdIsTheSameAsSavedImage', imageIdIsTheSameAsSavedImage)
      console.log('imageExists', imageExists)
      console.log('shouldFetchImage', shouldFetchImage)
    }

    if (shouldFetchImage && imageId) {
      fetchAndSetImage(imageId)
    }
  }, [imageId])

  useEffect(() => {
    return () => {
      DEBUG && console.log('ABORTING item & image fetch')
      itemRequestControllerRef?.current?.abort()
      imageRequestControllerRef?.current?.abort()
    }
  }, [])

  const itemState = {
    loadingItem: isLoadingItem,
    loadingImage: isLoadingImage,
    item: returnItem ? returnItem : localStorageItem || null,
    backendItem: backendItem?.clone(backendItem.toJSON()) || null,
    setBackendItem,
    image: !!returnItem?.imageId ? returnImage : null,
    ...(itemError ? { itemError: itemError } : {}),
    ...(imageError ? { imageError: imageError } : {})
  }

  const setItemToAtomAndLocalStorage = (update: UpdateParam<ItemDTO | null>) => {
    setItem(update)
    let parsedValue = update instanceof Function ? update(item) : update
    // set to localstorage here for both authenticated and not users so we don't need to pass this setter outside
    if (parsedValue) {
      parsedValue.updatedAt = unixtimeNow()
    }
    setLocalStorageItem(parsedValue)
  }

  const imageSetter = (update: UpdateParam<ImageDTO | null | undefined>) => {
    let parsedValue = update instanceof Function ? update(image) : update
    setImage(parsedValue)

    try {
      imageProcessingService.resizeImage(parsedValue?.base64 || '', { maxWidth: 320 }, (base64Image: string) => {
        if (parsedValue) {
          parsedValue.base64 = base64Image
        }
        setLocalStorageImage(parsedValue)
      })
    } catch (error: any) {
      setError(new StorageSyncError(error.message))
    }
  }

  return [itemState, setItemToAtomAndLocalStorage, imageSetter]
}

export default useItemWithImage
