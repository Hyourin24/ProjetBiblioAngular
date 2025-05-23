export interface User {
    admin : boolean;
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    email: string;
    booksOwned: string[];
    booksRead: string[];
    hashedPassword: string;
    isActive: boolean;
    addedAt: Date;
}