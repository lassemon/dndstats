import { DatabaseItemRepositoryInterface, ItemResponse, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { RemoveImageFromItemUseCase } from './RemoveImageFromItemUseCase'

export interface DeleteItemUseCaseOptions extends UseCaseOptionsInterface {
  itemId: string
  userId: string
}

export type RemoveImageFromItemUseCaseInterface = UseCaseInterface<DeleteItemUseCaseOptions, ItemResponse>

export class DeleteItemUseCase implements RemoveImageFromItemUseCaseInterface {
  constructor(
    private readonly itemRepository: DatabaseItemRepositoryInterface,
    private readonly removeImageFromItemUseCase: RemoveImageFromItemUseCase
  ) {}

  async execute({ itemId, userId, unknownError, invalidArgument }: DeleteItemUseCaseOptions) {
    const itemToDelete = await this.itemRepository.getById(itemId)
    await this.removeImageFromItemUseCase.execute({ itemId, userId, unknownError, invalidArgument })
    await this.itemRepository.delete(itemId)
    return itemToDelete
  }
}
