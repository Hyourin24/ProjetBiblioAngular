import { User } from "./User";

export interface Book {
    _id: string;
    title : string;
    description: string;
    genre: "fantasy" | "science-fiction" | "romance" | "mystery" | "non-fiction" | "historical" | "thriller" | "horror" | "biography" | "self-help" | "children's" | "young adult" | "poetry" | "classics" | "manga" | "comics" | "adventure" | "educative" | "cookbook" | "travel" | "humor" ;
    author: string;
    publishedYear: number;
    language: "french" | "ukrainian" | "english";
    state: "new"| "good" | "used"; 
    imageCouverture?: string | undefined;
    imageBack?: string | undefined;
    imageInBook?: string | undefined;
    readBy: string[]; 
    owner: string;
    isActive: boolean;
    ownerActive: boolean; 
    alreadyLoaned: boolean; 
    addedAt: Date;
}

export interface BookWithUser extends Book {
    user?: User;
}