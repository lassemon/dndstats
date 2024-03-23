import { Logger } from '@dmtool/common'
import { IllegalArgument, UnknownError } from '@dmtool/domain'

const log = new Logger('ErrorUtil')

export const throwUnknownError = (e?: unknown) => {
  log.error(`Failed to process use case due to error: ${e}`)
  throw new UnknownError(500, 'Unknown Error')
}

export const throwIllegalArgument = (argumentName: string) => {
  const error = `Failed to process request due to illegal argument ${argumentName}`
  log.warn(error)
  throw new IllegalArgument(400, 'Illegal Argument', error)
}
