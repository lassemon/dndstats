import { BaseImage, Image } from '@dmtool/domain'
import { FetchOptions } from '../interfaces/http/Fetch'
import { LocalStorageRepositoryInterface } from './LocalStorageRepositoryInterface'

export interface DatabaseImageRepositoryInterface {
  getById(imageId?: string): Promise<BaseImage>
  save(image: BaseImage): Promise<BaseImage>
  delete(imageId: string): Promise<void>
}

export interface HttpImageRepositoryInterface {
  getById(imageId?: string, options?: FetchOptions): Promise<Image>
  save(image: Image, options?: FetchOptions): Promise<Image>
  delete(imageId: string, options?: FetchOptions): Promise<Image>
}

export interface LocalStorageImageRepositoryInterface extends LocalStorageRepositoryInterface<Image> {}
