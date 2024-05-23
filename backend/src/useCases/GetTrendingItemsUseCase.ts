import {
  DatabaseItemRepositoryInterface,
  DatabaseItemViewsRepositoryInterface,
  ItemResponse,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'

export interface GetTrendingItemsUseCaseOptions extends UseCaseOptionsInterface {}

export type GetTrendingItemsUseCaseInterface = UseCaseInterface<GetTrendingItemsUseCaseOptions, ItemResponse[]>

export class GetTrendingItemsUseCase implements GetTrendingItemsUseCaseInterface {
  constructor(
    private readonly itemViewsRepository: DatabaseItemViewsRepositoryInterface,
    private readonly itemRepository: DatabaseItemRepositoryInterface
  ) {}
  async execute({}: GetTrendingItemsUseCaseOptions): Promise<ItemResponse[]> {
    const trendingItems = await this.itemViewsRepository.getMostTrendingItems(5)
    const items = await this.itemRepository.getItemsByIdsAndSources(
      trendingItems.map((trendingItem) => {
        return { itemId: trendingItem.itemId, source: trendingItem.source }
      })
    )
    const sortOrder = trendingItems.map((trendingItem) => trendingItem.itemId)
    return items.sort(function (a, b) {
      return sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id)
    })
  }
}
