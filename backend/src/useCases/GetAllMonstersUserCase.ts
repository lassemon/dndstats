import { UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { FifthApiServiceInterface } from '@dmtool/infrastructure'
import { constructUrl } from '/utils/url'
import { FifthESRDAPIReference } from '@dmtool/domain'

interface GetAllMonstersUseCaseResponse {
  count: number
  results: FifthESRDAPIReference[]
}

export interface GetAllMonstersUseCaseOptions extends UseCaseOptionsInterface {}

export type GetAllMonstersUseCaseInterface = UseCaseInterface<GetAllMonstersUseCaseOptions, GetAllMonstersUseCaseResponse>

export class GetAllMonstersUseCase implements GetAllMonstersUseCaseInterface {
  constructor(private readonly fifthApiService: FifthApiServiceInterface) {}

  async execute(options: GetAllMonstersUseCaseOptions) {
    const path = constructUrl(['monsters'])
    // TODO do any mapping from fifth api service to dmtool format here
    return await this.fifthApiService.get<GetAllMonstersUseCaseResponse>(path)
  }
}
