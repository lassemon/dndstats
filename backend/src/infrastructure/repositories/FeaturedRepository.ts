import { DatabaseFeaturedRepositoryInterface, FeaturedDBEntity } from '@dmtool/application'
import connection from '../database/connection'
import { ApiError } from '@dmtool/domain'
import { FeaturedEntity } from '@dmtool/application/src/interfaces/http/Featured'

class FeaturedRepository implements DatabaseFeaturedRepositoryInterface {
  async getFeaturedItem(): Promise<FeaturedEntity> {
    const featuredDBItem = await connection.select('*').from<any, FeaturedDBEntity>('featured').where('featured.entityType', 'Item').first()

    if (!featuredDBItem) {
      throw new ApiError(404, 'NotFound', `Featured item was not found.`)
    }
    return {
      ...featuredDBItem,
      isActive: featuredDBItem.isActive === 1 ? true : false
    }
  }
}

export default FeaturedRepository
