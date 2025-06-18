export interface EventBook {
    _id: string;
    title : string;
    description: string;
    images: string;
    language: "french" | "ukrainian" | "english";
    usersInEvent: string[];
    eventStartDate: Date;
    eventEndDate: Date;
    addedAt: Date;
    modifiedAt: Date;
}