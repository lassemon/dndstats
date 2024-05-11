import {
  BrowserImageProcessingService,
  HttpImageRepositoryInterface,
  HttpItemRepositoryInterface,
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
}

const useItemWithImage = (
  itemRepository: HttpItemRepositoryInterface,
  imageRepository: LocalStorageImageRepositoryInterface | HttpImageRepositoryInterface,
  itemId?: string,
  options: UseItemWithImageOptions = { persist: false }
): UseItemReturn => {
  const { persist } = options
  const [authState] = useAtom(authAtom)

  const itemRequestControllerRef = useRef<AbortController | null>(null)
  const imageRequestControllerRef = useRef<AbortController | null>(null)

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
  const imageId = returnItem?.imageId

  useEffect(() => {
    const fetchAndSetItem = async (_itemId: string) => {
      try {
        setIsLoadingItem(true)
        const controller = new AbortController()
        itemRequestControllerRef.current = controller
        const fetchedItem = await itemRepository.getById(_itemId, { signal: controller.signal })
        setIsLoadingItem(false)

        setBackendItem(new ItemDTO(fetchedItem))
        setLocalStorageItem(new ItemDTO({ ...fetchedItem, updatedAt: unixtimeNow() }))
        setItem(new ItemDTO(fetchedItem))

        if (!fetchedItem.imageId) {
          setImage(null)
          setLocalStorageImage(null)
        }
        if (fetchedItem.imageId !== localStorageImage?.id) {
          //setImage(null)
          //setLocalStorageImage(null)
        }
      } catch (error) {
        setIsLoadingItem(false)
        setItemError(error)
      }
    }

    const itemIdExists = !!itemId
    const itemIdIsTheSameAsSavedItem = itemId === (persist ? localStorageItem?.id : item?.id)
    const itemExists = persist ? !!localStorageItem : !!item

    const localStorageInvalidated = localStorageItem?.updatedAt || 0 < unixtimeNow() + config.localStorageInvalidateTimeInMilliseconds

    const shouldFetchItem =
      (itemIdExists && !itemIdIsTheSameAsSavedItem) ||
      (itemIdExists && !itemExists) ||
      (authState.loggedIn && itemIdExists && persist && localStorageInvalidated)

    /*
    console.log('itemIdExists', itemIdExists)
    console.log('backendItem?.id', backendItem?.id)
    console.log('localStorageItem?.id', localStorageItem?.id)
    console.log('itemId', itemId)
    console.log('isLoadingItem', isLoadingItem)
    console.log('persist', persist)
    console.log('item?.id', item?.id)
    console.log('itemIdIsTheSameAsSavedItem', itemIdIsTheSameAsSavedItem)
    console.log('itemExists', itemExists)
    console.log('local storage item last updated at', dateStringFromUnixTime(localStorageItem?.updatedAt || 0))
    console.log('localStorageInvalidated', localStorageInvalidated)
    console.log('shouldFetchItem', shouldFetchItem)
    console.log('\n\n\n')*/

    if (shouldFetchItem && !isLoadingItem) {
      fetchAndSetItem(itemId)
    } else if (!itemIdExists && !itemExists) {
      fetchAndSetItem('defaultItem')
    }

    return () => {
      itemRequestControllerRef?.current?.abort()
      imageRequestControllerRef?.current?.abort()
    }
  }, [itemId])

  useEffect(() => {
    const fetchAndSetImage = async (_imageId: string) => {
      try {
        setIsLoadingImage(true)
        const controller = new AbortController()
        imageRequestControllerRef.current = controller

        const fetchedImage = await imageRepository.getById(_imageId, { signal: controller.signal })
        setIsLoadingImage(false)

        setImage(new ImageDTO(fetchedImage))
        setLocalStorageImage(new ImageDTO(fetchedImage))
      } catch (error) {
        setIsLoadingImage(false)
        setImageError(error)
      }
    }

    const imageIdExists = !!imageId
    const imageIdIsTheSameAsSavedImage = imageId === (persist ? localStorageImage?.id : image?.id)
    const imageExists = persist ? !!localStorageImage : !!image
    const shouldFetchImage = (imageIdExists && !imageIdIsTheSameAsSavedImage) || (imageIdExists && !imageExists)

    /*
    console.log('imageIdExists', imageIdExists)
    console.log('imageIdIsTheSameAsSavedImage', imageIdIsTheSameAsSavedImage)
    console.log('imageExists', imageExists)
    console.log('shouldFetchImage', shouldFetchImage)*/

    if (shouldFetchImage) {
      fetchAndSetImage(imageId)
    }

    return () => {
      itemRequestControllerRef?.current?.abort()
      imageRequestControllerRef?.current?.abort()
    }
  }, [imageId])

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
