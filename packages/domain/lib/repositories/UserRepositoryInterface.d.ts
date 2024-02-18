import { User, UserResponse } from '../entities/User';
export interface UserRepositoryInterface<T extends User | UserResponse, CreateUserParam, UpdateUserParam> {
    getAll(): Promise<T[]>;
    getById(userId: string): Promise<T>;
    getByName(username: string): Promise<T>;
    count(): Promise<number>;
    create(user: CreateUserParam): Promise<T>;
    update(user: UpdateUserParam): Promise<T>;
    deactivate(userId: string): Promise<void>;
}
