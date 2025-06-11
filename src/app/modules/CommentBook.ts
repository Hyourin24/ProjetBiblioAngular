import { User } from "./User";

 export interface CommentBook {
    _id: string
    book_id: string;
    owner: string
    title: string;
    comment: string;
    date_création: Date;
    date_modification: Date
}

 export interface CommentWithUser extends CommentBook {
    user?: User;
  }