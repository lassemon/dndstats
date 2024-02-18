import { uuid } from '@dmtool/common'

abstract class DTO<T, V extends { id: string }> {
  protected _properties: V

  abstract isEqual(other: T): boolean
  abstract toJSON(): { [key: string]: any }
  abstract toString(): string
  abstract clone(): T

  constructor(props: V) {
    this._properties = {
      ...props,
      id: props.id ? props.id : uuid()
    }
  }
}

export default DTO
