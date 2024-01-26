import { DateTime } from 'luxon'

export default class Logger {
  public DATE_FORMAT
  public name

  constructor(name: string, dateFormat: string = 'DD-MM-YYYY HH:mm:ssZ') {
    this.name = name
    this.DATE_FORMAT = dateFormat
  }

  public debug(message: unknown) {
    if (process.env.LOG_LEVEL === 'DEBUG') {
      const formatted = this.formatMessage(message, 'DEBUG')
      console.log(formatted)
    }
  }

  public info(message: unknown) {
    const formatted = this.formatMessage(message, 'INFO')
    console.log(formatted)
  }

  public warn(message: unknown) {
    const formatted = this.formatMessage(message, 'WARN')
    console.warn(formatted)
  }

  public error(message: unknown) {
    const formatted = this.formatMessage(message, 'ERROR')
    console.error(formatted)
  }

  private formatMessage(message: unknown, level: string) {
    return `${this.name} ${this.getTimestamp()} ${level} - ${message}`
  }

  private getTimestamp() {
    return DateTime.now().toFormat(this.DATE_FORMAT)
  }
}
