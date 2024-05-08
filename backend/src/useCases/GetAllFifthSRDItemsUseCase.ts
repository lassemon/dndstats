import { ItemResponse, ItemSearchRequest, UseCaseInterface, UseCaseOptionsInterface } from '@dmtool/application'
import { FifthApiServiceInterface } from '@dmtool/infrastructure'
import { constructUrl } from '/utils/url'
import { FifthESRDAPIReferenceList, ItemCategory, Source, Visibility } from '@dmtool/domain'
import { unixtimeNow } from '@dmtool/common'
import _ from 'lodash'

interface GetAllFifthSRDItemsUseCaseResponse {
  count: number
  fifthApiItems: ItemResponse[]
}

export interface GetAllFifthSRDItemsUseCaseOptions extends UseCaseOptionsInterface, ItemSearchRequest {}

export type SearchItemsUseCaseInterface = UseCaseInterface<GetAllFifthSRDItemsUseCaseOptions, GetAllFifthSRDItemsUseCaseResponse>

export class GetAllFifthSRDItemsUseCase implements SearchItemsUseCaseInterface {
  constructor(private readonly fifthApiService: FifthApiServiceInterface) {}

  async execute(options: GetAllFifthSRDItemsUseCaseOptions) {
    const equipmentPath = constructUrl(['equipment'])
    const fifthApiEquipmentResponse = await this.fifthApiService.get<FifthESRDAPIReferenceList>(equipmentPath)

    const fifthApiEquipment = _.uniqBy(fifthApiEquipmentResponse.results, 'index').map((fiftApiItemReference): ItemResponse => {
      return {
        id: fiftApiItemReference.index,
        imageId: null,
        name: fiftApiItemReference.name,
        url: fiftApiItemReference.url,
        attunement: {
          required: false
        },
        shortDescription: '',
        mainDescription: '',
        price: {
          quantity: null,
          unit: null
        },
        rarity: null,
        weight: null,
        features: [],
        categories: [],
        visibility: Visibility.PUBLIC,
        source: Source.FifthESRD,
        createdAt: unixtimeNow(),
        createdBy: '0', //TODO use env variable here to set system id for createdBy
        createdByUserName: 'system'
      }
    })

    const magicItemPath = constructUrl(['magic-items'])
    const fifthApiMagicItemResponse = await this.fifthApiService.get<FifthESRDAPIReferenceList>(magicItemPath)

    const fifthApiMagicItems = _.uniqBy(fifthApiMagicItemResponse.results, 'index').map((fiftApiItemReference): ItemResponse => {
      return {
        id: fiftApiItemReference.index,
        imageId: null,
        name: fiftApiItemReference.name,
        url: fiftApiItemReference.url,
        attunement: {
          required: false
        },
        shortDescription: '',
        mainDescription: '',
        price: {
          quantity: null,
          unit: null
        },
        rarity: null,
        weight: null,
        features: [],
        categories: [ItemCategory.MAGIC_ITEM],
        visibility: Visibility.PUBLIC,
        source: Source.FifthESRD,
        createdAt: unixtimeNow(),
        createdBy: '0', //TODO use env variable here to set system id for createdBy
        createdByUserName: 'system'
      }
    })

    const fifthApiItems = ([] as ItemResponse[]).concat(fifthApiEquipment).concat(fifthApiMagicItems)

    return {
      count: fifthApiItems.length,
      fifthApiItems: _.orderBy(fifthApiItems, options.orderBy, options.order)
    }
  }
}
