import { DatabaseItemViewsRepositoryInterface, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { Source } from '@dmtool/domain'

export interface IncreaseItemViewCountUseCaseOptions extends UseCaseOptionsInterface {
  itemId: string
  source: `${Source}`
}

export type IncreaseItemViewCountUseCaseInterface = UseCaseInterface<IncreaseItemViewCountUseCaseOptions, void>

export class IncreaseItemViewCountUseCase implements IncreaseItemViewCountUseCaseInterface {
  constructor(private readonly itemViewRepository: DatabaseItemViewsRepositoryInterface) {}
  async execute({ itemId, source }: IncreaseItemViewCountUseCaseOptions): Promise<void> {
    await this.itemViewRepository.incrementViewCount(itemId, source)
  }
}
