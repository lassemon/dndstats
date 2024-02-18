import { User, UserInsertQuery, UserInsertRequest, UserResponse, UserUpdateQuery, UserUpdateRequest } from '@dmtool/domain';
import { FetchOptions } from '../interfaces/http/Fetch';
export interface DatabaseUserRepositoryInterface {
    getAll(): Promise<User[]>;
    getById(userId: string): Promise<User>;
    getByName(username: string): Promise<User>;
    count(): Promise<number>;
    create(user: UserInsertQuery): Promise<User>;
    update(user: UserUpdateQuery): Promise<User>;
    deactivate(userId: string): Promise<void>;
}
export interface HttpUserRepositoryInterface {
    getAll(options?: FetchOptions): Promise<UserResponse[]>;
    getById(userId: string, options?: FetchOptions): Promise<UserResponse>;
    count(options?: FetchOptions): Promise<number>;
    create(user: UserInsertRequest, options?: FetchOptions): Promise<UserResponse>;
    update(user: UserUpdateRequest, options?: FetchOptions): Promise<UserResponse>;
    deactivate(userId: string, options?: FetchOptions): Promise<void>;
}
