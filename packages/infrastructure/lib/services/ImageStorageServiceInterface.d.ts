/// <reference types="node" />
export interface ImageStorageServiceInterface {
    deleteImageFromFileSystem: (fileName: string) => void;
    writeImageBufferToFile: (imageBuffer: Buffer, fileName: string, previousFileName?: string) => void;
}
