export interface ImageStorageServiceInterface {
  removeImageFromFileSystem: (fileName: string) => void
  writeImageBufferToFile: (imageBuffer: Buffer, fileName: string, previousFileName?: string) => void
}
