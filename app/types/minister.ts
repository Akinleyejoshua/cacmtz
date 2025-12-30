export interface Minister {
    _id: string;
    name: string;
    position: string;
    department: string;
    email?: string;
    phone?: string;
    bio?: string;
    images?: string[];
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

