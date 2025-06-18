export interface User {
    _id: string;
    admin : boolean;
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    email: string;
    booksOwned: string[];
    booksRead: string[];
    booksReserved: string[];
    eventReserved: string[];
    hashedPassword: string;
    isActive: boolean;
    addedAt: Date;
}

