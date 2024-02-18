import { v4 as _uuid } from 'uuid'

export const uuid = (): string => {
  return _uuid()
}
