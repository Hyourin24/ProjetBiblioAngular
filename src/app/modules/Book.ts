export interface Book {
    data // Indique si le propriétaire du livre est actif ou non
      (data: any): unknown;
    _id: string;
    title : string;
    description: string;
    genre: string;
    author: string;
    publishedYear: number;
    language: "french" | "ukrainian" | "english";
    state: "new"| "good" | "used"; // État du livre (neuf, bon état, usé, etc.)
    images?: string[] | undefined;
    readBy: string[]; // Tableau d'IDs de livres lus
    owner: string;
    isActive: boolean;
    ownerActive: boolean; // Indique si le propriétaire du livre est actif ou non
    alreadyLoaned: boolean; // Indique si le livre est déjà emprunté
    addedAt: Date;
}