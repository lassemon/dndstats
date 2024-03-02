import { UserRole } from '../enums/UserRole';
export interface User {
    id: string;
    name: string;
    password: string;
    email: string;
    roles: UserRole[];
    active: boolean;
    createdAt: number;
    updatedAt?: number;
}
