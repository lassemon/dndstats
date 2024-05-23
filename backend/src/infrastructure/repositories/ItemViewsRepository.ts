import { DatabaseItemViewsRepositoryInterface, ItemViews } from '@dmtool/application'
import { Source } from '@dmtool/domain'
import connection from '../database/connection'

class ItemViewsRepository implements DatabaseItemViewsRepositoryInterface {
  async getMostTrendingItems(limit: number): Promise<ItemViews[]> {
    return await connection
      .select('*')
      .from<any, ItemViews[]>('itemViews')
      .orderBy('viewCount', 'desc')
      .limit(limit || 5)
  }

  async incrementViewCount(itemId: string, source: `${Source}`): Promise<void> {
    await connection.raw(
      `
      INSERT INTO itemViews (itemId, source, viewCount)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE viewCount = viewCount + 1`,
      [itemId, source]
    )
  }

  async removeItemViews(itemId: string, source: `${Source}`): Promise<void> {
    await connection('itemViews').where('itemId', itemId).andWhere('source', source).delete()
  }
}

export default ItemViewsRepository
