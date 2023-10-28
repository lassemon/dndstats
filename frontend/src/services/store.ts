import _ from 'lodash'

export const store = async (key: string, data: any) => {
  return await Promise.resolve(localStorage.setItem(key, JSON.stringify(data)))
}

export const load = async (key: string) => {
  const storedItem = JSON.parse(localStorage.getItem(key) || '{}')
  return await Promise.resolve(!_.isEmpty(storedItem) ? storedItem : null)
  //return await new Promise((resolve) => setTimeout(resolve, 500, !_.isEmpty(storedItem) ? storedItem : null))
}

export const clear = async (key: string) => {
  return await new Promise<void>((resolve, reject) => {
    localStorage.removeItem(key)
    resolve()
  })
}
