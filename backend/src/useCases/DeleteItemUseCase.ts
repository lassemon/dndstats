import { DatabaseItemRepositoryInterface, ItemResponse, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { RemoveImageFromItemUseCase } from './RemoveImageFromItemUseCase'
import { RemoveItemViewsUseCaseInterface } from './RemoveItemViewsUseCase'

export interface DeleteItemUseCaseOptions extends UseCaseOptionsInterface {
  itemId: string
  userId: string
}

export type RemoveImageFromItemUseCaseInterface = UseCaseInterface<DeleteItemUseCaseOptions, ItemResponse>

export class DeleteItemUseCase implements RemoveImageFromItemUseCaseInterface {
  constructor(
    private readonly itemRepository: DatabaseItemRepositoryInterface,
    private readonly removeImageFromItemUseCase: RemoveImageFromItemUseCase,
    private readonly removeItemViewsUseCase: RemoveItemViewsUseCaseInterface
  ) {}

  async execute({ itemId, userId, unknownError, invalidArgument }: DeleteItemUseCaseOptions) {
    const itemToDelete = await this.itemRepository.getById(itemId)
    await this.removeItemViewsUseCase.execute({ itemId: itemToDelete.id, source: itemToDelete.source, unknownError, invalidArgument })
    await this.removeImageFromItemUseCase.execute({ itemId, userId, unknownError, invalidArgument })
    await this.itemRepository.delete(itemId)
    return itemToDelete
  }
}
