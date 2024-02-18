import { DateTime } from 'luxon'

export const unixtimeNow = (): number => {
  return DateTime.now().toUnixInteger()
}
