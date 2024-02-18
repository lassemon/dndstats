import { BaseImage } from '../entities/Image';
export interface ImageRepositoryInterface<T extends BaseImage> {
    getById(imageId?: string): Promise<T>;
    save(image: T): Promise<T>;
    delete(imageId: string): Promise<void>;
}
