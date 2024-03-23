import {
  DatabaseItemRepositoryInterface,
  ItemSearchRequest,
  ItemSearchResponse,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'

interface GetAllPublicItemsUseCaseResponse extends ItemSearchResponse {}

export interface GetAllPublicItemsUseCaseOptions extends UseCaseOptionsInterface, ItemSearchRequest {}

export type GetAllPublicItemsUseCaseInterface = UseCaseInterface<GetAllPublicItemsUseCaseOptions, GetAllPublicItemsUseCaseResponse>

export class GetAllPublicItemsUseCase implements GetAllPublicItemsUseCaseInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface) {}
  async execute({ unknownError, invalidArgument, ...itemSearchRequest }: GetAllPublicItemsUseCaseOptions) {
    //const { itemsPerPage, pageNumber, onlyMyItems, rarity } = itemSearchRequest
    const items = await this.itemRepository.getAllPublic()
    return {
      items,
      totalCount: items.length
    }
  }
}
