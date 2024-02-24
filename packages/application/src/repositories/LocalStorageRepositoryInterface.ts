export interface LocalStorageRepositoryInterface<T> {
  getById(id?: string): Promise<T> | T
  save(entity: T | null, key?: string): Promise<T> | T
  delete(id: string): Promise<T> | T
  clearAll?(): Promise<void> | void
}
