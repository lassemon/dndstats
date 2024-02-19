import { Item } from '@dmtool/domain';
import DTO from './DTO';
export declare class ItemDTO extends DTO<ItemDTO, Item> {
    constructor(item: Item);
    get id(): string;
    set id(value: string);
    get imageId(): string | null;
    set imageId(value: string | null);
    get name(): string;
    set name(value: string);
    get shortDescription(): string;
    get shortDescription_label(): string;
    set shortDescription(value: string);
    get mainDescription(): string;
    set mainDescription(value: string);
    get price(): string;
    set price(value: string);
    get rarity(): string;
    set rarity(value: string);
    get weight(): string;
    set weight(value: string);
    get features(): {
        featureName: string;
        featureDescription: string;
    }[];
    set features(value: {
        featureName: string;
        featureDescription: string;
    }[]);
    get visibility(): import("@dmtool/domain").Visibility;
    set visibility(value: import("@dmtool/domain").Visibility);
    get source(): "5th_e_SRD" | "Homebrew" | "My_Items" | "System";
    set source(value: "5th_e_SRD" | "Homebrew" | "My_Items" | "System");
    get createdBy(): string;
    set createdBy(value: string);
    get createdAt(): number;
    set createdAt(value: number);
    get updatedAt(): number | undefined;
    set updatedAt(value: number | undefined);
    clone(attributes?: Partial<Item>): ItemDTO;
    isEqual(otherItem: ItemDTO | object | null): boolean;
    toJSON(): Item;
    toString(): string;
}
export default ItemDTO;
