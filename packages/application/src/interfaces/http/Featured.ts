export interface FeaturedDBEntity {
  entityType: string
  entityId: string
  startDate: Date
  endDate: Date
  isActive: number
}

export interface FeaturedEntity extends Omit<FeaturedDBEntity, 'isActive'> {
  isActive: boolean
}
