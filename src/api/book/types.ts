import { IAuthorRow } from "../author/types";
import { ICategoryRow } from "../category/types";

export interface IBookRating {
	rating: number | null;
	reviews: number | null;
}

export interface IBookRow {
	id: string;
	name: string;
	price: number;
	language: string | null;
	description: string;
	currency: {
		id: string;
		currency_acronym: string;
		currency_name: string;
	};
	book_categories: { category: { name: string }; category_id: string }[];
	book_authors: {
		author: { first_name: string; last_name: string };
		author_id: string;
	}[];
}

export interface IBookEditPayload {
	id: string;
	name?: string;
	price?: number;
	language?: string;
	description?: string;
	currency_id?: string;
	author?: IAuthorRow["id"][];
	category?: ICategoryRow["id"][];
}

export interface IBookCreatePayload {
	id?: string;
	name: string;
	price: number;
	language: string;
	description: string;
	currency_id: string;
	author: IAuthorRow["id"][];
	category: ICategoryRow["id"][];
}

export interface IBookAuthorPayload {
	book_id: string;
	author_id: string;
}

export interface IBookCategoryPayload {
	book_id: string;
	category_id: string;
}

export interface IBooksPayload {
	perPage: boolean;
	page: number;
	author: IAuthorRow["id"][];
	category: ICategoryRow["id"][];
	limit: number;
	priceFrom: number;
	priceTo: number;
}
