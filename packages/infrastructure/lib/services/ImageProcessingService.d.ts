/// <reference types="node" />
import { ImageProcessingServiceInterface } from './ImageProcessingServiceInterface';
export declare class ImageProcessingService implements ImageProcessingServiceInterface {
    resizeImage(buffer: Buffer, resizeOptions: {
        width: number;
    }): Promise<Buffer>;
}
