export interface ImageProcessingServiceInterface {
  resizeImage: (buffer: Buffer, resizeOptions: { width: number; height?: number }) => Promise<Buffer>
  getBufferMimeType: (buffer: Buffer) => Promise<string | undefined>
}
