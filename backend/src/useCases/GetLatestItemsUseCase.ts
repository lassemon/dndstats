import { DatabaseItemRepositoryInterface, ItemResponse, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'

export interface GetLatestItemsUseCaseOptions extends UseCaseOptionsInterface {}

export type GetLatestItemsUseCaseInterface = UseCaseInterface<GetLatestItemsUseCaseOptions, ItemResponse[]>

export class GetLatestItemsUseCase implements GetLatestItemsUseCaseInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface) {}
  async execute({}: GetLatestItemsUseCaseOptions): Promise<ItemResponse[]> {
    const latestItems = await this.itemRepository.getLatest(5, true)
    return latestItems.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
  }
}
