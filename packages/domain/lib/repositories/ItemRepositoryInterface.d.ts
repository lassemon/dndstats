import { Item } from '../entities/Item';
import { User, UserResponse } from '../entities/User';
export interface ItemRepositoryInterface {
    getAll(): Promise<Item[]>;
    getAllForUser(userId: string): Promise<Item[]>;
    countItemsCreatedByUser(userId: string): Promise<number>;
    getById(itemId?: string): Promise<Item>;
    save(item: Item, user: User | UserResponse): Promise<Item>;
    delete(itemId: string): Promise<void>;
}
