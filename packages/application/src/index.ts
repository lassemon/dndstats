export { ItemDTO } from './dtos/ItemDTO'
export { ImageDTO } from './dtos/ImageDTO'

export type { LocalStorageRepositoryInterface } from './repositories/LocalStorageRepositoryInterface'
export type {
  DatabaseItemRepositoryInterface,
  HttpItemRepositoryInterface,
  LocalStorageItemRepositoryInterface
} from './repositories/ItemRepositoryInterface'
export type {
  DatabaseImageRepositoryInterface,
  HttpImageRepositoryInterface,
  LocalStorageImageRepositoryInterface
} from './repositories/ImageRepositoryInterface'
export type { DatabaseUserRepositoryInterface, HttpUserRepositoryInterface } from './repositories/UserRepositoryInterface'
export type { DatabaseFeaturedRepositoryInterface } from './repositories/FeaturedRepositoryInterface'

export { ItemService } from './services/ItemService'
export type { ItemServiceInterface } from './services/ItemServiceInterface'

export { UserService } from './services/UserService'
export type { UserServiceInterface } from './services/UserServiceInterface'

export { BrowserImageProcessingService } from './services/BrowserImageProcessingService'
export type { BrowserImageProcessingServiceInterface } from './services/BrowserImageProcessingServiceInterface'

export type { UseCaseInterface, UseCaseOptionsInterface } from './useCases/UseCaseInterface'

export type { UserResponse, UserInsertRequest, UserInsertQuery, UserUpdateRequest, UserUpdateQuery } from './interfaces/http/User'
export type {
  DBItem,
  ItemDBResponse,
  BaseItemResponse,
  ArmorItemResponse,
  WeaponItemResponse,
  ItemResponse,
  ItemInsertQuery,
  ItemUpdateQuery,
  ItemUpdateRequest,
  ItemUpdateResponse,
  ItemSearchQuery,
  ItemCountQuery,
  PriceSearchQuery,
  WeightSearchQuery,
  ItemSearchRequest,
  ItemSearchResponse,
  ItemViews
} from './interfaces/http/Item'

export type { DatabaseItemViewsRepositoryInterface } from './repositories/itemViewsRepositoryInterface'

export type { FeaturedDBEntity } from './interfaces/http/Featured'

export type { FetchOptions } from './interfaces/http/Fetch'

export type { ProfileResponse } from './interfaces/http/Profile'
export type { PageStatsResponse } from './interfaces/http/PageStats'

export { ITEM_DEFAULTS } from './enums/defaults/ItemDefaults'

export { Encryption } from './security/Encryption'
export { isWeapon, isArmor, isFifthESRDEquipment, isFifthESRDMagicItem } from './utils/typeutils'
