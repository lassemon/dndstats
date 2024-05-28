import {
  DatabaseItemRepositoryInterface,
  DatabaseItemViewsRepositoryInterface,
  ItemResponse,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'

export interface GetTrendingItemsUseCaseOptions extends UseCaseOptionsInterface {
  loggedIn: boolean
}

export type GetTrendingItemsUseCaseInterface = UseCaseInterface<GetTrendingItemsUseCaseOptions, ItemResponse[]>

export class GetTrendingItemsUseCase implements GetTrendingItemsUseCaseInterface {
  constructor(
    private readonly itemViewsRepository: DatabaseItemViewsRepositoryInterface,
    private readonly itemRepository: DatabaseItemRepositoryInterface
  ) {}
  async execute({ loggedIn }: GetTrendingItemsUseCaseOptions): Promise<ItemResponse[]> {
    const trendingItems = await this.itemViewsRepository.getMostTrendingItems(5, loggedIn)
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
