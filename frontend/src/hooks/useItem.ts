import { ItemDTO } from '@dmtool/application'
import { FrontendItemRepositoryInterface } from 'infrastructure/repositories/ItemRepository'
import { useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { UpdateParam, itemAtom } from 'state/itemAtom'

type UseItemReturn = [
  {
    loading: boolean
    persistedItem: ItemDTO | null
    setPersistedItem: React.Dispatch<React.SetStateAction<ItemDTO | null>>
    item: ItemDTO | null
    error?: any
  },
  (update: UpdateParam<ItemDTO | null>) => void
]

const useItem = (itemRepository: FrontendItemRepositoryInterface, itemId?: string): UseItemReturn => {
  const controllerRef = useRef<AbortController | null>(null)

  const [persistedItem, setPersistedItem] = useState<ItemDTO | null>(null)
  const [item, setItem] = useAtom(itemAtom)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAndSetItem = async () => {
      try {
        setIsLoading(true)
        const controller = new AbortController()
        controllerRef.current = controller
        const fetchedItem = await itemRepository.getById(itemId, { signal: controller.signal }).finally(() => {
          setIsLoading(false)
        })
        const itemDTO = new ItemDTO(fetchedItem)
        setPersistedItem(itemDTO)
        setItem(itemDTO)
      } catch (error) {
        setError(error)
      }
    }

    //console.log(`\n\n\nshould I fetch item? itemId:${itemId}`, item)
    const itemIdExists = !!itemId
    const itemIdIsTheSameAsSavedItem = itemId === item?.id
    const itemExists = !!item

    //console.log('itemIdExists', itemIdExists)
    //console.log('itemIdIsTheSameAsSavedImage', itemIdIsTheSameAsSavedItem)
    //console.log('itemExists', itemExists)

    //console.log('should i fetch item', (itemIdExists && !itemIdIsTheSameAsSavedItem) || (itemIdExists && !itemExists))

    if ((itemIdExists && !itemIdIsTheSameAsSavedItem) || (itemIdExists && !itemExists)) {
      fetchAndSetItem()
    }

    return () => {
      controllerRef?.current?.abort()
    }
  }, [itemId])

  const itemState = {
    loading: isLoading,
    item,
    persistedItem,
    setPersistedItem,
    ...(error ? { error: error } : {})
  }

  const setItemToAtomAndLocalStorage = (update: UpdateParam<ItemDTO | null>) => {
    setItem(update)
    const parsedValue = update instanceof Function ? update(item) : update
    if (parsedValue) {
      itemRepository.saveToLocalStorage(parsedValue.toJSON())
    }
  }

  return [itemState, setItemToAtomAndLocalStorage]
}

export default useItem
