/// <reference types="node" />
import { ResizeOptions } from 'sharp';
export interface ImageProcessingServiceInterface {
    resizeImage: (buffer: Buffer, resizeOptions: ResizeOptions) => Promise<Buffer>;
}
