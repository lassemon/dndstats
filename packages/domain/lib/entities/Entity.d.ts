import { Visibility } from '../enums/Visibility';
export declare enum Source {
    FifthESRD = "5th_e_SRD",
    HomeBrew = "Homebrew",
    MyItem = "My_Items",
    System = "System"
}
export interface Entity {
    id: string;
    visibility: Visibility;
    source: `${Source}`;
    createdBy: string;
    createdAt: number;
    updatedAt?: number;
}