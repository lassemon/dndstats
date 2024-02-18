/// <reference types="node" />
import { ImageMetadata } from '@dmtool/domain';
import { ImageServiceInterface } from './ImageServiceInterface';
export declare class ImageService implements ImageServiceInterface {
    convertBase64ImageToBuffer(base64ImageData: string): Buffer;
    convertBufferToBase64Image(imageBuffer: Buffer, metadata: ImageMetadata): string;
    parseImageFilename(metadata: ImageMetadata): string;
}
