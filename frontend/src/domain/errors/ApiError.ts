export default class ApiError extends Error {
  public status: number
  public statusText: string
  public response?: string
  public context?: any

  constructor(status: number, statusText: string, message?: string, context?: any) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.statusText = statusText
    this.context = context
    this.message = message ?? `${status} - ${statusText}`
  }
}
