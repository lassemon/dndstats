import { DatabaseItemViewsRepositoryInterface, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { Source } from '@dmtool/domain'

export interface RemoveItemViewsUseCaseOptions extends UseCaseOptionsInterface {
  itemId: string
  source: `${Source}`
}

export type RemoveItemViewsUseCaseInterface = UseCaseInterface<RemoveItemViewsUseCaseOptions, void>

export class RemoveItemViewsUseCase implements RemoveItemViewsUseCaseInterface {
  constructor(private readonly itemViewRepository: DatabaseItemViewsRepositoryInterface) {}
  async execute({ itemId, source }: RemoveItemViewsUseCaseOptions): Promise<void> {
    await this.itemViewRepository.removeItemViews(itemId, source)
  }
}
