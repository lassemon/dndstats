/// <reference types="node" />
import { ImageStorageServiceInterface } from './ImageStorageServiceInterface';
export declare class ImageStorageService implements ImageStorageServiceInterface {
    deleteImageFromFileSystem(fileName: string): Promise<void>;
    writeImageBufferToFile(imageBuffer: Buffer, fileName: string): void;
}
