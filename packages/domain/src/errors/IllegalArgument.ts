export class IllegalArgument extends Error {
  public status: number
  public statusText: string

  constructor(status: number = 400, statusText: string, message?: string, context?: any) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.statusText = statusText
    this.message = message ?? `${status} - ${statusText}`
  }
}
