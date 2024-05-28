import { DatabaseItemRepositoryInterface, ItemResponse, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'

export interface GetLatestItemsUseCaseOptions extends UseCaseOptionsInterface {
  loggedIn: boolean
}

export type GetLatestItemsUseCaseInterface = UseCaseInterface<GetLatestItemsUseCaseOptions, ItemResponse[]>

export class GetLatestItemsUseCase implements GetLatestItemsUseCaseInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface) {}
  async execute({ loggedIn }: GetLatestItemsUseCaseOptions): Promise<ItemResponse[]> {
    const latestItems = await this.itemRepository.getLatest(5, loggedIn)
    return latestItems.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
  }
}
