import { Image } from '@dmtool/domain/src/entities/Image'
import { Item } from '@dmtool/domain/src/entities/Item'
import {
  ItemInsertQuery,
  ItemResponse,
  ItemSearchQuery,
  ItemSearchRequest,
  ItemSearchResponse,
  ItemUpdateResponse
} from '../interfaces/http/Item'
import { FetchOptions } from '../interfaces/http/Fetch'
import { LocalStorageRepositoryInterface } from './LocalStorageRepositoryInterface'

export interface DatabaseItemRepositoryInterface {
  getAllPublic(): Promise<ItemResponse[]>
  countAll(): Promise<number>
  count(query: ItemSearchQuery): Promise<number>
  search(query: ItemSearchQuery): Promise<ItemResponse[]>
  getAllVisibleForLoggedInUser(userId: string): Promise<ItemResponse[]>
  getAllForUser(userId: string): Promise<ItemResponse[]>
  getSystemItemsByName(itemName: string): Promise<ItemResponse[]>
  getUserItemsByName(itemName: string, userId: string): Promise<ItemResponse[]>
  countItemsCreatedByUser(userId: string): Promise<number>
  getById(itemId?: string): Promise<ItemResponse>
  create(item: ItemInsertQuery, userId: string): Promise<ItemResponse>
  update(item: ItemInsertQuery, userId: string): Promise<ItemResponse>
  delete(itemId: string): Promise<void>
}

export interface HttpItemRepositoryInterface {
  getAll(options?: FetchOptions): Promise<ItemSearchResponse>
  search(query: ItemSearchRequest, options?: FetchOptions): Promise<ItemSearchResponse>
  getAllForUser(userId: string, options?: FetchOptions): Promise<ItemResponse[]>
  getById(itemId?: string, options?: FetchOptions): Promise<ItemResponse>
  save(item: Item, image?: Image | null, options?: FetchOptions): Promise<ItemUpdateResponse>
  delete(itemId: string, options?: FetchOptions): Promise<ItemResponse>
}

export interface LocalStorageItemRepositoryInterface extends LocalStorageRepositoryInterface<Item> {}
