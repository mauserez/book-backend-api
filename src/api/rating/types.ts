import { User } from "../user/types";
import { IBookRow } from "../book/types";

export interface IRatingRow {}

export interface IRatingPayload {
	id: string;
	user_id: string;
	book_id: IBookRow["id"];
	rating: number;
}

export interface RatingRecord {
	id: string;
	book_id: string;
	user_id: string;
	value: number;
}
