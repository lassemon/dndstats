import { DatabaseItemRepositoryInterface, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { Image, Item, User } from '@dmtool/domain'
import { SaveImageUseCase } from './SaveImageUseCase'
import { RemoveImageFromItemUseCase } from './RemoveImageFromItemUseCase'

interface SaveImageUseCaseBody {
  user: User
  item: Item
  image?: Image | null
}

interface SaveImageUseCaseResponse extends Omit<SaveImageUseCaseBody, 'user'> {}

export interface SaveItemUseCaseOptions extends UseCaseOptionsInterface, SaveImageUseCaseBody {}

export type SaveItemUseCaseInterface = UseCaseInterface<SaveItemUseCaseOptions, SaveImageUseCaseResponse>

export class SaveItemUseCase implements SaveItemUseCaseInterface {
  constructor(
    private readonly itemRepository: DatabaseItemRepositoryInterface,
    private readonly saveImageUseCase: SaveImageUseCase,
    private readonly removeImageFromItemUseCase: RemoveImageFromItemUseCase
  ) {}
  async execute({ user, item, image, unknownError, invalidArgument }: SaveItemUseCaseOptions): Promise<SaveImageUseCaseResponse> {
    let savedImage = null
    if (image) {
      image.metadata.fileName = item.name.replaceAll(' ', '').toLowerCase()
      savedImage = await this.saveImageUseCase.execute({ image, unknownError, invalidArgument })
    } else {
      await this.removeImageFromItemUseCase.execute({ item, user, unknownError, invalidArgument })
    }

    const savedItem = await this.itemRepository.save(item, user.id)

    return {
      item: savedItem,
      image: savedImage
    }
  }
}
