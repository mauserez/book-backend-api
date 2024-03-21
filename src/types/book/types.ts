import { Decimal } from "@prisma/client/runtime/library";
import { Author } from "../author/types";
import { Category } from "../category/types";
import { Currency } from "../currency/types";
import { User } from "../user/types";

export interface IBookRow {
	id: string;
	name: string;
	price: number;
	language: string | null;
	description: string;
	currency_acronym: number;
	rating_count: number | Decimal | null;
	rating_value: number | Decimal | null;
}

export interface IBook {
	id: string;
	name: string;
	price: number;
	language: string;
	description: string;
	currencyAcronym: Currency["name"];
	ratingCount: number;
	ratingValue: number;
}

export interface IBookEditPayload {
	id: string;
	name: string;
	price: number;
	language: string;
	description: string;
	currency_id: string;
	authors: Author["id"][];
	categories: Category["id"][];
	user: User["id"];
}

export interface IBooksPayload {
	perPage: boolean;
	page: number;
	author: Author["id"][];
	category: Category["id"][];
	limit: number;
}

export type IBookCreatePayload = Omit<IBookEditPayload, "id">;

export interface IBookAuthorPayload {
	book_id: string;
	author_id: string;
}

export interface IBookCategoryPayload {
	id: string;
	book_id: string;
	category_id: string;
}
