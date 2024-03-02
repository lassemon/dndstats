/// <reference types="node" />
export interface ImageProcessingServiceInterface {
    resizeImage: (buffer: Buffer, resizeOptions: {
        width: number;
    }) => Promise<Buffer>;
    getBufferMimeType: (buffer: Buffer) => Promise<string | undefined>;
}
