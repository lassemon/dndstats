import { Image } from '@dmtool/domain/src/entities/Image'
import { Item } from '@dmtool/domain/src/entities/Item'
import { ItemInsertQuery, ItemInsertResponse, ItemResponse, ItemUpdateRequest, ItemUpdateResponse } from '../interfaces/http/Item'
import { FetchOptions } from '../interfaces/http/Fetch'
import { LocalStorageRepositoryInterface } from './LocalStorageRepositoryInterface'

export interface DatabaseItemRepositoryInterface {
  getAll(): Promise<ItemResponse[]>
  countAll(): Promise<number>
  getAllVisibleForLoggedInUser(userId: string): Promise<ItemResponse[]>
  getAllForUser(userId: string): Promise<ItemResponse[]>
  getSystemItemsByName(itemName: string): Promise<ItemResponse[]>
  getUserItemsByName(itemName: string, userId: string): Promise<ItemResponse[]>
  countItemsCreatedByUser(userId: string): Promise<number>
  getById(itemId?: string): Promise<ItemResponse>
  create(item: ItemInsertQuery, userId: string): Promise<ItemInsertResponse>
  update(item: ItemInsertQuery, userId: string): Promise<ItemInsertResponse>
  delete(itemId: string): Promise<void>
}

export interface HttpItemRepositoryInterface {
  getAll(options?: FetchOptions): Promise<ItemResponse[]>
  getAllForUser(userId: string, options?: FetchOptions): Promise<ItemResponse[]>
  getById(itemId?: string, options?: FetchOptions): Promise<ItemResponse>
  save(item: Item, image?: Image | null, options?: FetchOptions): Promise<ItemUpdateResponse>
  delete(itemId: string, options?: FetchOptions): Promise<ItemResponse>
}

export interface LocalStorageItemRepositoryInterface extends LocalStorageRepositoryInterface<Item> {}
