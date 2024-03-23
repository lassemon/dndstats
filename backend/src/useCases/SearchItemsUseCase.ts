import {
  DatabaseItemRepositoryInterface,
  ItemSearchRequest,
  ItemSearchResponse,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'
import { ComparisonOption } from '@dmtool/domain'

interface SearchItemsUseCaseResponse extends ItemSearchResponse {}

export interface SearchItemsUseCaseOptions extends UseCaseOptionsInterface, ItemSearchRequest {
  userId?: string
}

export type SearchItemsUseCaseInterface = UseCaseInterface<SearchItemsUseCaseOptions, SearchItemsUseCaseResponse>

export class SearchItemsUseCase implements SearchItemsUseCaseInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface) {}

  private anyFilterDefined(filters: ItemSearchRequest): boolean {
    return filters && Object.keys(filters).length > 0
  }

  async execute({ userId, unknownError, invalidArgument, ...itemSearchRequest }: SearchItemsUseCaseOptions) {
    if (this.anyFilterDefined(itemSearchRequest)) {
      const {
        itemsPerPage,
        pageNumber,
        onlyMyItems,
        visibility,
        rarity,
        priceComparison,
        priceQuantity,
        priceUnit,
        weightComparison,
        weight
      } = itemSearchRequest
      console.log('userId', userId)
      console.log('visibility', visibility)
      if (!userId && visibility) {
        invalidArgument('visibility')
      }
      const itemCount = await this.itemRepository.count({
        userId,
        onlyMyItems,
        visibility,
        rarity,
        ...(priceQuantity
          ? {
              price: {
                comparison: priceComparison || ComparisonOption.EXACTLY,
                quantity: priceQuantity,
                unit: priceUnit || 'gp'
              }
            }
          : {}),
        ...(weight
          ? {
              weight: {
                comparison: weightComparison || ComparisonOption.EXACTLY,
                quantity: weight
              }
            }
          : {})
      })
      const items = await this.itemRepository.search({
        itemsPerPage,
        pageNumber,
        onlyMyItems,
        userId,
        visibility,
        rarity,
        ...(priceQuantity
          ? {
              price: {
                comparison: priceComparison || ComparisonOption.EXACTLY,
                quantity: priceQuantity,
                unit: priceUnit || 'gp'
              }
            }
          : {}),
        ...(weight
          ? {
              weight: {
                comparison: weightComparison || ComparisonOption.EXACTLY,
                quantity: weight
              }
            }
          : {})
      })
      console.log('itemCount', itemCount)
      console.log('items', items.length)
      return {
        items,
        totalCount: itemCount
      }
    } else if (userId) {
      const items = await this.itemRepository.getAllVisibleForLoggedInUser(userId)
      return {
        items,
        totalCount: items.length
      }
    } else {
      const items = await this.itemRepository.getAllPublic()
      return {
        items,
        totalCount: items.length
      }
    }
  }
}
