import { Item } from '@dmtool/domain';
export interface ItemServiceInterface {
    systemItemsWithSameNameCount: (itemName: string) => Promise<number>;
    userItemsWithSameName: (itemName: string, userId: string) => Promise<Item[]>;
    itemExists: (itemId: string, userId: string) => Promise<boolean>;
    itemWithNameExistsForUser: (itemId: string, itemName: string, userId: string) => Promise<boolean>;
    getEndIndexFromItemName: (itemName?: string) => string;
}
export default ItemServiceInterface;
