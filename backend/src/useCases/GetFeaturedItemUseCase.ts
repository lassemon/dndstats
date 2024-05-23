import {
  DatabaseFeaturedRepositoryInterface,
  DatabaseItemRepositoryInterface,
  ItemResponse,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@dmtool/application'

export interface GetFeaturedItemUseCaseOptions extends UseCaseOptionsInterface {}

export type GetFeaturedItemUseCaseInterface = UseCaseInterface<GetFeaturedItemUseCaseOptions, ItemResponse>

export class GetFeaturedItemUseCase implements GetFeaturedItemUseCaseInterface {
  constructor(
    private readonly featuredRepository: DatabaseFeaturedRepositoryInterface,
    private readonly itemRepository: DatabaseItemRepositoryInterface
  ) {}
  async execute(options: GetFeaturedItemUseCaseOptions): Promise<ItemResponse> {
    const featuredItem = await this.featuredRepository.getFeaturedItem()
    return await this.itemRepository.getById(featuredItem.entityId)
  }
}
