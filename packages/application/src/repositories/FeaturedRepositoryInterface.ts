import { FeaturedEntity } from '../interfaces/http/Featured'

export interface DatabaseFeaturedRepositoryInterface {
  getFeaturedItem(): Promise<FeaturedEntity>
}
