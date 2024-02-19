export interface ImageProcessingServiceInterface {
  resizeImage: (buffer: Buffer, resizeOptions: { width: number }) => Promise<Buffer>
}
