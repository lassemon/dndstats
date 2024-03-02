import { PartialExceptFor } from '@dmtool/common';
import { UserRole } from '@dmtool/domain';
export interface UserResponse {
    id: string;
    name: string;
    email: string;
    roles: UserRole[];
    createdAt: number;
    updatedAt?: number;
}
export interface UserInsertRequest {
    name: string;
    email: string;
    password: string;
}
export interface UserInsertQuery {
    id: string;
    name: string;
    password: string;
    email: string;
    roles: UserRole[];
    active: boolean;
    created: Date;
}
export type UserUpdateRequest = Partial<{
    name: string;
    email: string;
    oldPassword: string;
    newPassword: string;
}>;
export type UserUpdateQuery = PartialExceptFor<{
    id: string;
    name: string;
    password: string;
    email: string;
    roles: UserRole[];
}, 'id'>;
