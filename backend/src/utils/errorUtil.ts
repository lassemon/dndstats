import { Logger } from '@dmtool/common'
import UnknownError from '/domain/errors/UnknownError'

const log = new Logger('ErrorUtil')

export const throwUnknownError = (e?: unknown) => {
  log.error(`Failed to process use case due to error: ${e}`)
  throw new UnknownError(500, 'Unknown Error')
}

export const throwIllegalArgument = (argumentName: string) => {
  log.warn(`Failed to process request due to illegal argument ${argumentName}`)
}
