import ItemServiceInterface from './ItemServiceInterface';
import { DatabaseItemRepositoryInterface } from '../repositories/ItemRepositoryInterface';
export declare class ItemService implements ItemServiceInterface {
    private readonly itemRepository;
    constructor(itemRepository: DatabaseItemRepositoryInterface);
    systemItemsWithSameNameCount(itemName: string): Promise<number>;
    userItemsWithSameName(itemName: string, userId: string): Promise<import("..").ItemResponse[]>;
    itemExists(itemId: string, userId: string): Promise<boolean>;
    itemWithNameExistsForUser(itemId: string, itemName: string, userId: string): Promise<boolean>;
    getEndIndexFromItemName(itemName?: string): string;
}
