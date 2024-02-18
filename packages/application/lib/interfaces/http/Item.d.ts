import { Image, Item } from '@dmtool/domain';
export interface ItemUpdateRequest {
    item: Item;
    image?: Image | null;
}
export interface ItemUpdateResponse {
    item: Item;
    image?: Image | null;
}
