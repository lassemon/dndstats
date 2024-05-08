import { ApiError } from './ApiError'

export class ApiValidateError extends ApiError {
  constructor(status: number, statusText: string, message?: string, context?: any) {
    super(status, statusText, message, context)
  }
}
