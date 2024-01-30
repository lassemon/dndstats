import { Item } from 'services/defaults'
import { post } from 'utils/fetch'
import { uuid } from 'utils/utils'

export const saveItem = async (item: Item) => {
  if (!item.id) {
    item.id = uuid()
  }
  const saveResponse = await post({ endpoint: '/item', payload: item })
  console.log('save response', saveResponse)
}

export const loadItem = async (id: string) => {}
