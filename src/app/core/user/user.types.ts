export interface User {
    id: string;
    name: string;
    email: string;
    tenantId?: string;
    avatar?: string;
    status?: string;
}

export enum UserRole {
    ADMIN = 'admin',
    GUEST = 'guest',
    TENANT = 'tenant',
    RECEPTIONIST = 'receptionist',
    MANAGER = 'manager',
    ROOM_SERVICE = 'room-service',
    CLEANER = 'cleaner',
}

export const StaffRoleList = [
    { role: UserRole.RECEPTIONIST, label: 'Réceptionniste' },
    { role: UserRole.MANAGER, label: 'Manager' },
    { role: UserRole.ROOM_SERVICE, label: 'Service chambre' },
    { role: UserRole.CLEANER, label: 'Nettoyeur' },
];
