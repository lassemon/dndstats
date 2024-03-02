export interface UserServiceInterface {
  validatePasswordChange: (userId: string, newPassword: string, oldPassword?: string) => Promise<boolean>
  validateNewPassword: (newPassword: string) => boolean
  getUserNameByUserId: (userId: string) => Promise<string>
}
