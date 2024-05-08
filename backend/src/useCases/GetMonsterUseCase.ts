import { UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { FifthApiServiceInterface } from '@dmtool/infrastructure'
import { constructUrl } from '/utils/url'

// TODO type response
interface GetMonsterUseCaseResponse {}

export interface GetMonsterUseCaseOptions extends UseCaseOptionsInterface {
  monsterName: string
}

export type GetMonsterUseCaseInterface = UseCaseInterface<GetMonsterUseCaseOptions, GetMonsterUseCaseResponse>

export class GetMonsterUseCase implements GetMonsterUseCaseInterface {
  constructor(private readonly fifthApiService: FifthApiServiceInterface) {}

  async execute({ monsterName }: GetMonsterUseCaseOptions) {
    const path = constructUrl(['monsters', monsterName])
    // TODO do any mapping from fifth api service to dmtool format here
    return this.fifthApiService.get<GetMonsterUseCaseResponse>(path)
  }
}
