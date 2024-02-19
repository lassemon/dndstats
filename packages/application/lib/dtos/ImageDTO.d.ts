import { Image, ImageMetadata, Visibility } from '@dmtool/domain';
import DTO from './DTO';
interface ImageDTOProperties extends ImageMetadata {
    base64: string;
}
export declare class ImageDTO extends DTO<ImageDTO, ImageDTOProperties> {
    constructor(image: Image);
    get id(): string;
    set id(value: string);
    get visibility(): Visibility;
    set visibility(value: Visibility);
    get source(): "5th_e_SRD" | "Homebrew" | "My_Items" | "System";
    set source(value: "5th_e_SRD" | "Homebrew" | "My_Items" | "System");
    get fileName(): string;
    set fileName(value: string);
    get mimeType(): string;
    set mimeType(value: string);
    get size(): number;
    set size(value: number);
    get description(): string | undefined;
    set description(value: string | undefined);
    get ownerId(): string | undefined;
    set ownerId(value: string | undefined);
    get ownerType(): "item" | "weapon" | "monster" | undefined;
    set ownerType(value: "item" | "weapon" | "monster" | undefined);
    get createdBy(): string;
    set createdBy(value: string);
    get createdAt(): number;
    set createdAt(value: number);
    get updatedAt(): number | undefined;
    set updatedAt(value: number | undefined);
    get base64(): string;
    set base64(value: string);
    clone(attributes?: Partial<Image>): ImageDTO;
    isEqual(otherImage: ImageDTO | object | null): boolean;
    private isSavingDefaultImage;
    parseForSaving(imageBase64: string): Image;
    toJSON(): Image;
    toString(): string;
}
export {};
