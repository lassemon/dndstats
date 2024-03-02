import { DateTime } from 'luxon'

export const unixtimeNow = (): number => {
  return DateTime.now().toUnixInteger()
}

export const dateStringFromUnixTime = (unixtime: number): string => {
  return DateTime.fromSeconds(unixtime).setZone('Europe/Helsinki').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
}
