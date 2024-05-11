import { Logger } from '@dmtool/common'
import { IllegalArgument, UnknownError } from '@dmtool/domain'

const logger = new Logger('ErrorUtil')

export const throwUnknownError = (e?: any) => {
  logger.error(`Failed to process use case due to error: ${e}`, e.stack ? e.stack : e)
  throw new UnknownError(500, 'Unknown Error')
}

export const throwIllegalArgument = (argumentName: string) => {
  const error = `Failed to process request due to illegal argument ${argumentName}`
  logger.warn(error)
  throw new IllegalArgument(400, 'Illegal Argument', error)
}
