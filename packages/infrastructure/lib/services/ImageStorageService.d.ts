/// <reference types="node" />
import { ImageStorageServiceInterface } from './ImageStorageServiceInterface';
export declare class ImageStorageService implements ImageStorageServiceInterface {
    removeImageFromFileSystem(fileName: string): Promise<void>;
    writeImageBufferToFile(imageBuffer: Buffer, fileName: string): void;
}
