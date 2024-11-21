export interface Items {
    folders: Item[];
    files: Item[];
    path: any[];
}

export interface Item {
    id?: string;
    folderId?: string;
    name?: string;
    createdBy?: string;
    createdAt?: string;
    modifiedAt?: string;
    size?: string;
    type?: string;
    contents?: string | null;
    description?: string | null;
}

export interface Room {
    _id?: string;
    tenantId?: any;
    propertyId?: any;
    roomName?: string;
    roomNumber?: string;
    type?: string;
    status?: string;
    smartLock?: Record<string, any>;
    currentGuest?: any;
    currentEKey?: any;
    price?: number;
    isActive?: boolean;
    createdAt?: any;
    updatedAt?: any;
}

export interface FetchAllRoomDto {
    propertyId: string;
    skip?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
}

export interface CreateRoomDto {
    roomName: string;
    roomNumber: string;
    propertyId: string;
    price?: number;
}

export interface UpdateRoomDto extends CreateRoomDto {}

export interface FetchAllRoomResponse {
    data: Room[];
    total: number;
}

export enum RoomStatus {
    AVAILABLE = 'available',
    OCCUPIED = 'occupied',
    MAINTENANCE = 'maintenance',
}
