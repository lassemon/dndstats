import { DatabaseItemRepositoryInterface, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { Image, Item } from '@dmtool/domain'
import { SaveImageUseCase } from './SaveImageUseCase'
import { RemoveImageFromItemUseCase } from './RemoveImageFromItemUseCase'

interface SaveImageUseCaseBody {
  userId: string
  item: Item
  image?: Image | null
}

interface SaveImageUseCaseResponse extends Omit<SaveImageUseCaseBody, 'userId'> {}

export interface SaveItemUseCaseOptions extends UseCaseOptionsInterface, SaveImageUseCaseBody {}

export type SaveItemUseCaseInterface = UseCaseInterface<SaveItemUseCaseOptions, SaveImageUseCaseResponse>

export class SaveItemUseCase implements SaveItemUseCaseInterface {
  constructor(
    private readonly itemRepository: DatabaseItemRepositoryInterface,
    private readonly saveImageUseCase: SaveImageUseCase,
    private readonly removeImageFromItemUseCase: RemoveImageFromItemUseCase
  ) {}
  async execute({ userId, item, image, unknownError, invalidArgument }: SaveItemUseCaseOptions): Promise<SaveImageUseCaseResponse> {
    // To keep things as simple as possible, saving image and item always togeher
    // First removing old image, whether item is new or updated, the old image is redundant

    await this.removeImageFromItemUseCase.execute({ itemId: item.id, userId, unknownError, invalidArgument })
    let savedImage = null
    if (image) {
      image.metadata.fileName = item.name.replaceAll(' ', '').toLowerCase()
      savedImage = await this.saveImageUseCase.execute({ image, unknownError, invalidArgument })
    }

    const savedItem = await this.itemRepository.save(item, userId)

    return {
      item: savedItem,
      image: savedImage
    }
  }
}
