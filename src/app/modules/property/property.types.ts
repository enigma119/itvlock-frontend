export interface Category {
    id?: string;
    title?: string;
    slug?: string;
}

export interface Course {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    duration?: number;
    steps?: {
        order?: number;
        title?: string;
        subtitle?: string;
        content?: string;
    }[];
    totalSteps?: number;
    updatedAt?: number;
    featured?: boolean;
    progress?: {
        currentStep?: number;
        completed?: number;
    };
}

export interface Property {
    id?: string;
    tenantId?: string;
    name?: string;
    address?: string;
    totalRooms?: number;
    amenities?: Amenity[];
}

export interface CreatePropertyDto {
    name?: string;
    address?: string;
    totalRooms?: number;
    amenities?: Amenity[];
}

export interface UpdatePropertyDto {
    name?: string;
    address?: string;
    totalRooms?: number;
    amenities?: Amenity[];
}

export interface FetchPropertyDto {
    skip?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
}

export interface FetchPropertyResponse {
    data?: Property[];
    total?: number;
}

export interface Amenity {
    id?: string;
    name?: string;
    description?: string;
    icon?: string;
}
