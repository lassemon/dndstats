import { User } from '@dmtool/domain'
import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: User // Assuming User is imported or defined elsewhere
}
