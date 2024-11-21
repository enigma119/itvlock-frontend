import { User, UserRole } from "app/core/user/user.types";

export interface Contact {
    id: string;
    avatar?: string | null;
    background?: string | null;
    name: string;
    emails?: {
        email: string;
        label: string;
    }[];
    phoneNumbers?: {
        country: string;
        phoneNumber: string;
        label: string;
    }[];
    title?: string;
    company?: string;
    birthday?: string | null;
    address?: string | null;
    notes?: string | null;
    tags: string[];
}

export interface Country {
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag {
    id?: string;
    title?: string;
}

export interface FetchStaffParams {
    role: UserRole;
    searchValue?: string;
    skip: number;
    limit: number;
}

export interface FetchStaffResponse {
    data: StaffUser[];
    total: number;
}

export interface StaffUser {
    _id: string;
    fullName: string;
    avatar?: string;
    email?: string;
    phoneNumbers?: {
        country: string;
        phoneNumber: string;
        label: string;
    }[];
    address?: string;
    role: UserRole;
    createdAt?: Date;
}

export interface UpdateStaffRoleParams {
    userId: string;
    role: UserRole.RECEPTIONIST | UserRole.MANAGER | UserRole.ROOM_SERVICE | UserRole.CLEANER;
}

export interface ChangeStaffPasswordParams {
    userId: string;
    password: string;
}
