/// <reference types="node" />
import { ResizeOptions } from 'sharp';
import { ImageProcessingServiceInterface } from './ImageProcessingServiceInterface';
export declare class ImageProcessingService implements ImageProcessingServiceInterface {
    resizeImage(buffer: Buffer, resizeOptions: ResizeOptions): Promise<Buffer>;
}
