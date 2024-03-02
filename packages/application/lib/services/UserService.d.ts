import { DatabaseUserRepositoryInterface } from '../repositories/UserRepositoryInterface';
import { UserServiceInterface } from './UserServiceInterface';
export declare class UserService implements UserServiceInterface {
    private readonly userRepository;
    constructor(userRepository: DatabaseUserRepositoryInterface);
    validatePasswordChange(userId: string, newPassword: string, oldPassword?: string): Promise<boolean>;
    validateNewPassword(newPassword: string): boolean;
    getUserNameByUserId(userId: string): Promise<string>;
}
