export default class UnknownError extends Error {
  public status: number
  public statusText: string

  constructor(status: number, statusText: string, message?: string) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.statusText = statusText
    this.message = message ?? `${status} - ${statusText}`
  }
}
