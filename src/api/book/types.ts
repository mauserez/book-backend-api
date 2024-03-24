import { Decimal } from "@prisma/client/runtime/library";
import { IAuthorRow } from "../author/types";
import { ICategoryRow } from "../category/types";

export interface IBookRow {
	id: string;
	name: string;
	price: number;
	language: string | null;
	description: string;
	currency_acronym: string;
	rating_count: number | Decimal | null;
	rating_value: number | Decimal | null;
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
}
