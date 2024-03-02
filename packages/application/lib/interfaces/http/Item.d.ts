import { Image, Item } from '@dmtool/domain';
export interface DBItem extends Omit<Item, 'features'> {
    features: string;
}
export interface ItemDBResponse extends DBItem {
    createdByUserName: string;
}
export interface ItemResponse extends Item {
    createdByUserName: string;
}
export interface ItemUpdateRequest {
    item: Item;
    image?: Image | null;
}
export interface ItemUpdateResponse {
    item: ItemResponse;
    image?: Image | null;
}
export interface ItemInsertQuery extends Item {
}
export interface ItemInsertResponse extends Omit<ItemResponse, 'createdByUserName'> {
}
