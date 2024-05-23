import {
  DatabaseItemRepositoryInterface,
  ItemResponse,
  ItemSearchRequest,
  ItemSearchResponse,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'
import { ComparisonOption, ItemRarity, Source } from '@dmtool/domain'
import { GetAllFifthSRDItemsUseCase } from './GetAllFifthSRDItemsUseCase'
import { FifthApiService } from '@dmtool/infrastructure'
import _ from 'lodash'
import { Order } from '@dmtool/common'

interface SearchItemsUseCaseResponse extends ItemSearchResponse {}
const fifthApiService = new FifthApiService()

export interface SearchItemsUseCaseOptions extends UseCaseOptionsInterface, ItemSearchRequest {
  userId?: string
}

export type SearchItemsUseCaseInterface = UseCaseInterface<SearchItemsUseCaseOptions, SearchItemsUseCaseResponse>

export class SearchItemsUseCase implements SearchItemsUseCaseInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface) {}

  async execute(options: SearchItemsUseCaseOptions) {
    const { userId, unknownError, invalidArgument, ...itemSearchRequest } = options
    try {
      const getAllFifthSRDItemsUseCase = new GetAllFifthSRDItemsUseCase(fifthApiService)
      const isAnyFilterDefined = this.anyFilterDefined(itemSearchRequest)

      const shouldGetAllFifthApiItems = !isAnyFilterDefined

      const fifthApiResponse = shouldGetAllFifthApiItems
        ? await getAllFifthSRDItemsUseCase.execute({
            order: itemSearchRequest.order,
            orderBy: itemSearchRequest.orderBy,
            unknownError,
            invalidArgument
          })
        : { count: 0, fifthApiItems: [] }

      let itemList = []
      let totalCount = itemList.length

      if (isAnyFilterDefined) {
        if (!userId && options.visibility) {
          invalidArgument('visibility')
        }
        const { items, itemCount } = await this.searchItemsWithFilters(options)
        itemList = items
        totalCount = itemCount
      } else if (userId) {
        const { items, itemCount } = await this.getAllItemsForLoggedInUser(userId, options.orderBy, options.order)
        itemList = items
        totalCount = itemCount
      } else {
        const { items, itemCount } = await this.getAllPublicItems(options.orderBy, options.order)
        itemList = items
        totalCount = itemCount
      }

      const itemsJoinedWithFifthApiItems = this.combineItems(itemList as Array<ItemResponse>, fifthApiResponse.fifthApiItems)
      const fifthApiItemsInDbCount = await this.itemRepository.count({ source: [Source.FifthESRD] })

      const itemCountFromExternalResources = fifthApiResponse.count - fifthApiItemsInDbCount

      const sortedItems = this.sortItems(itemsJoinedWithFifthApiItems, itemSearchRequest.orderBy, itemSearchRequest.order)

      return {
        items: this.paginateItems(sortedItems, options.itemsPerPage, options.pageNumber),
        totalCount: totalCount + (shouldGetAllFifthApiItems ? itemCountFromExternalResources : 0)
      }
    } catch (error) {
      unknownError(error)
      throw error
    }
  }

  private paginateItems = (items: ItemResponse[], itemsPerPage: number | undefined, pageNumber: number = 0) => {
    const startIndex = itemsPerPage ? (pageNumber || 1 - 1) * (itemsPerPage || items.length) : 0
    const endIndex = itemsPerPage ? startIndex + (itemsPerPage || items.length) : items.length

    return items.slice(startIndex, endIndex)
  }

  private searchItemsWithFilters = async (queryParams: SearchItemsUseCaseOptions) => {
    const itemCount = await this.itemRepository.count(this.constructItemCountQueryParams(queryParams))
    const items = await this.itemRepository.search(this.constructItemSearchQueryParams(queryParams))
    return {
      items,
      itemCount
    }
  }

  private getAllItemsForLoggedInUser = async (userId: string, orderBy: string = 'name', order: `${Order}` = Order.ASCENDING) => {
    const items = await this.itemRepository.getAllVisibleForLoggedInUser(userId, orderBy, order)
    const itemCount = items.length
    return {
      items,
      itemCount
    }
  }

  private getAllPublicItems = async (orderBy: string = 'name', order: `${Order}` = Order.ASCENDING) => {
    const items = await this.itemRepository.getAllPublic(orderBy, order)
    const itemCount = items.length
    return {
      items,
      itemCount
    }
  }

  private anyFilterDefined(filters: ItemSearchRequest): boolean {
    if (!filters) {
      return false
    }
    const anyNonMandatoryFilterExists =
      _.without(Object.keys(filters), 'itemsPerPage', 'pageNumber', 'onlyMyItems', 'order', 'orderBy').length > 0
    return anyNonMandatoryFilterExists || filters.onlyMyItems === true
  }

  private constructItemCountQueryParams = ({
    userId,
    onlyMyItems = false,
    search,
    visibility,
    category,
    property,
    source,
    rarity,
    priceComparison,
    priceQuantity,
    priceUnit,
    weightComparison,
    weight
  }: Omit<SearchItemsUseCaseOptions, 'order' | 'orderBy'>) => {
    return {
      userId,
      onlyMyItems,
      search,
      category,
      property,
      visibility,
      source,
      rarity,
      ...(priceQuantity
        ? {
            price: {
              comparison: priceComparison || ComparisonOption.EXACTLY,
              quantity: Number(priceQuantity),
              unit: priceUnit || 'gp'
            }
          }
        : {}),
      ...(weight
        ? {
            weight: {
              comparison: weightComparison || ComparisonOption.EXACTLY,
              quantity: Number(weight)
            }
          }
        : {})
    }
  }

  private constructItemSearchQueryParams = ({
    userId,
    onlyMyItems = false,
    order = 'asc',
    orderBy = 'name',
    search,
    visibility,
    category,
    property,
    source,
    rarity,
    priceComparison,
    priceQuantity,
    priceUnit,
    weightComparison,
    weight,
    requiresAttunement,
    hasImage
  }: SearchItemsUseCaseOptions) => {
    return {
      onlyMyItems,
      order,
      orderBy,
      userId,
      search,
      visibility,
      category,
      property,
      source,
      rarity,
      requiresAttunement,
      hasImage,
      ...(priceQuantity
        ? {
            price: {
              comparison: priceComparison || ComparisonOption.EXACTLY,
              quantity: Number(priceQuantity),
              unit: priceUnit || 'gp'
            }
          }
        : {}),
      ...(weight
        ? {
            weight: {
              comparison: weightComparison || ComparisonOption.EXACTLY,
              quantity: Number(weight)
            }
          }
        : {})
    }
  }

  private combineItems = (databaseItems: ItemResponse[], fifthApiItems: ItemResponse[]): ItemResponse[] => {
    const itemMap = new Map()

    // Add database items to the map; these take priority
    databaseItems.forEach((item) => {
      itemMap.set(item.id, item)
    })

    // Add Fifth API items only if they don't already exist in the map
    fifthApiItems.forEach((item) => {
      if (!itemMap.has(item.id)) {
        itemMap.set(item.id, item)
      }
    })

    return Array.from(itemMap.values())
  }

  private sortItems = (_items: ItemResponse[], orderBy: string = 'name', order: `${Order}` = Order.ASCENDING) => {
    return _.orderBy(
      _items,
      [
        (item) => {
          switch (orderBy) {
            case 'rarity':
              switch (item.rarity) {
                case ItemRarity.VARIES:
                  return 1
                case ItemRarity.COMMON:
                  return 2
                case ItemRarity.UNCOMMON:
                  return 3
                case ItemRarity.RARE:
                  return 4
                case ItemRarity.VERY_RARE:
                  return 5
                case ItemRarity.LEGENDARY:
                  return 6
                case ItemRarity.ARTIFACT:
                  return 7
                default:
                  return ''
              }
            default:
              return _.get(item, orderBy) || ''
          }
        }
      ],
      order
    )
  }
}
