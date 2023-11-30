export const getNumberWithSign = (theNumber: number) => {
  if (theNumber > 0) {
    return '+' + theNumber
  } else {
    return theNumber.toString()
  }
}

export const replaceItemAtIndex = <T>(arr: T[], index: number, newValue: T) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const upsertToArray = <T>(arr: T[], obj: T, key: keyof T): T[] => {
  const array = [...arr]
  const index = array.findIndex((element) => element[key] === obj[key])

  if (index === -1) {
    array.push(obj)
  } else {
    array[index] = obj
  }
  return array
}
