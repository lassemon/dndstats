import {
  HttpImageRepositoryInterface,
  HttpItemRepositoryInterface,
  ImageDTO,
  ItemDTO,
  LocalStorageImageRepositoryInterface
} from '@dmtool/application'
import { unixtimeNow } from '@dmtool/common'
import { StorageSyncError } from 'domain/errors/StorageError'
import { errorAtom } from 'infrastructure/dataAccess/atoms'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import React, { useEffect, useRef, useState } from 'react'
import { UpdateParam, itemAtom } from 'state/itemAtom'

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
      localStorage.setItem(key, JSON.stringify({ ...newValue?.toJSON(), updatedAt: unixtimeNow() }))
    },
    removeItem: (key) => {
      localStorage.removeItem(key)
    }
  },
  { getOnInit: true }
)
const localStorageImageAtom = atomWithStorage<ImageDTO | null | undefined>('localImageAtom', null, undefined, { getOnInit: true })

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

  const itemRequestControllerRef = useRef<AbortController | null>(null)
  const imageRequestControllerRef = useRef<AbortController | null>(null)

  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))

  const [item, setItem] = useAtom(itemAtom)
  const [persistedItem, setPersistedItem] = useAtom(localStorageItemAtom)
  const [backendItem, setBackendItem] = useState<ItemDTO | null>(null)

  const [image, setImage] = useState<ImageDTO | null | undefined>(null)
  const [persistedImage, setPersistedImage] = useAtom(localStorageImageAtom)

  const [itemError, setItemError] = useState<any>(null)
  const [imageError, setImageError] = useState<any>(null)
  const [isLoadingItem, setIsLoadingItem] = useState(false)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  const returnItem = (persist === true && persistedItem ? persistedItem : item) || null
  const returnImage = (persist === true ? persistedImage : image) || null
  const imageId = returnItem?.imageId

  useEffect(() => {
    const fetchAndSetItem = async (_itemId: string) => {
      try {
        setIsLoadingItem(true)
        const controller = new AbortController()
        itemRequestControllerRef.current = controller
        const fetchedItem = await itemRepository.getById(_itemId, { signal: controller.signal })
        setIsLoadingItem(false)
        const itemDTO = new ItemDTO(fetchedItem)

        setBackendItem(itemDTO)
        setPersistedItem(itemDTO)
        setItem(itemDTO)

        if (!itemDTO?.imageId) {
          setImage(null)
          setPersistedImage(null)
        }
      } catch (error) {
        setIsLoadingItem(false)
        setItemError(error)
      }
    }

    const itemIdExists = !!itemId
    const itemIdIsTheSameAsSavedItem = itemId === (persist ? persistedItem?.id : item?.id)
    const itemExists = persist ? !!persistedItem : !!item

    if ((itemIdExists && !itemIdIsTheSameAsSavedItem) || (itemIdExists && !itemExists)) {
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

        const fetchedImage = await Promise.resolve(imageRepository.getById(_imageId, { signal: controller.signal }))
        setIsLoadingImage(false)

        setImage(new ImageDTO(fetchedImage))
        setPersistedImage(new ImageDTO(fetchedImage))
      } catch (error) {
        setIsLoadingImage(false)
        setImageError(error)
      }
    }

    const imageIdExists = !!imageId
    const imageIdIsTheSameAsSavedImage = imageId === (persist ? persistedImage?.id : image?.id)
    const imageExists = persist ? !!persistedImage : !!image

    if ((imageIdExists && !imageIdIsTheSameAsSavedImage) || (imageIdExists && !imageExists)) {
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
    item: returnItem,
    backendItem,
    setBackendItem,
    image: !!returnItem?.imageId ? returnImage : null,
    ...(itemError ? { itemError: itemError } : {}),
    ...(imageError ? { imageError: imageError } : {})
  }

  const setItemToAtomAndLocalStorage = (update: UpdateParam<ItemDTO | null>) => {
    setItem(update)
    let parsedValue = update instanceof Function ? update(item) : update
    setPersistedItem(parsedValue)
  }

  const imageSetter = (update: UpdateParam<ImageDTO | null | undefined>) => {
    let parsedValue = update instanceof Function ? update(image) : update
    setImage(parsedValue)
    try {
      setPersistedImage(parsedValue)
    } catch (error: any) {
      setError(new StorageSyncError(error.message))
    }
  }

  return [itemState, setItemToAtomAndLocalStorage, imageSetter]
}

export default useItemWithImage
