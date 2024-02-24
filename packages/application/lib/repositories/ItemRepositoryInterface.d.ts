import { Image } from '@dmtool/domain/src/entities/Image';
import { Item } from '@dmtool/domain/src/entities/Item';
import { ItemUpdateResponse } from '../interfaces/http/Item';
import { FetchOptions } from '../interfaces/http/Fetch';
import { LocalStorageRepositoryInterface } from './LocalStorageRepositoryInterface';
export interface DatabaseItemRepositoryInterface {
    getAll(): Promise<Item[]>;
    getAllVisibleForLoggedInUser(): Promise<Item[]>;
    getAllForUser(userId: string): Promise<Item[]>;
    countItemsCreatedByUser(userId: string): Promise<number>;
    getById(itemId?: string): Promise<Item>;
    save(item: Item, userId: string): Promise<Item>;
    delete(itemId: string): Promise<void>;
}
export interface HttpItemRepositoryInterface {
    getAll(options?: FetchOptions): Promise<Item[]>;
    getAllForUser(userId: string, options?: FetchOptions): Promise<Item[]>;
    getById(itemId?: string, options?: FetchOptions): Promise<Item>;
    save(item: Item, image?: Image | null, options?: FetchOptions): Promise<ItemUpdateResponse>;
    delete(itemId: string, options?: FetchOptions): Promise<Item>;
}
export interface LocalStorageItemRepositoryInterface extends LocalStorageRepositoryInterface<Item> {
}
