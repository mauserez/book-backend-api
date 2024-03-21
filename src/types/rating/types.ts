import { User } from "../user/types";
import { IBook } from "../book/types";

export interface Rating {
	id: string;
	user: User;
	book: IBook;
	value: number;
}

export interface IRatingPayload {
	id: string;
	user: string;
	book: IBook;
	rating: number;
}

export interface RatingRecord {
	id: string;
	id_book: string;
	id_user: string;
	value: number;
}
