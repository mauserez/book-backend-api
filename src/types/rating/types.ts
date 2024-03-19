import { User } from "../user/types";
import { Book } from "../book/types";

export interface Rating {
	id: string;
	user: User;
	book: Book;
	value: number;
}

export interface IRatingPayload {
	id: string;
	user: string;
	book: Book;
	rating: number;
}

export interface RatingRecord {
	id: string;
	id_book: string;
	id_user: string;
	value: number;
}
