import { Item, Image, Source } from '@dmtool/domain'
import {
  ItemCountQuery,
  ItemInsertQuery,
  ItemResponse,
  ItemSearchQuery,
  ItemSearchRequest,
  ItemSearchResponse,
  ItemUpdateQuery,
  ItemUpdateResponse
} from '../interfaces/http/Item'
import { FetchOptions } from '../interfaces/http/Fetch'
import { LocalStorageRepositoryInterface } from './LocalStorageRepositoryInterface'
import { Order } from '@dmtool/common'

export interface DatabaseItemRepositoryInterface {
  getAllPublic(orderBy: string, order: `${Order}`): Promise<ItemResponse[]>
  countAll(): Promise<number>
  count(query: ItemCountQuery): Promise<number>
  search(query: ItemSearchQuery): Promise<ItemResponse[]>
  getAllVisibleForLoggedInUser(userId: string, orderBy: string, order: `${Order}`): Promise<ItemResponse[]>
  getAllForUser(userId: string): Promise<ItemResponse[]>
  getSystemItemsByName(itemName: string): Promise<ItemResponse[]>
  getUserItemsByName(itemName: string, userId: string): Promise<ItemResponse[]>
  countItemsCreatedByUser(userId: string): Promise<number>
  getById(itemId?: string): Promise<ItemResponse>
  getByImageId(imageId: string): Promise<ItemResponse[]>
  getByIdAndSource(itemId: string, source: `${Source}`): Promise<ItemResponse>
  create(item: ItemInsertQuery, userId: string): Promise<ItemResponse>
  update(item: ItemUpdateQuery): Promise<ItemResponse>
  delete(itemId: string): Promise<void>
}

export interface HttpItemRepositoryInterface {
  getAll(options?: FetchOptions): Promise<ItemSearchResponse>
  search(query: ItemSearchRequest, options?: FetchOptions): Promise<ItemSearchResponse>
  getAllForUser(userId: string, options?: FetchOptions): Promise<ItemResponse[]>
  getById(itemId?: string, options?: FetchOptions): Promise<ItemResponse>
  getByIdAndSource(id: string, source: `${Source}`, options?: FetchOptions): Promise<ItemResponse>
  save(item: Item, image?: Image | null, options?: FetchOptions): Promise<ItemUpdateResponse>
  delete(itemId: string, options?: FetchOptions): Promise<ItemResponse>
}

export interface LocalStorageItemRepositoryInterface extends LocalStorageRepositoryInterface<Item> {}
