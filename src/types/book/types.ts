import { Author } from "../author/types";

export interface Book {
	id: string;
	name: string;
	categories: Category[];
	language: string;
	price: number;
	currency: Currency | undefined;
	published: number;
	authors: Author[];
	rating: number;
	description: string;
	esteemes: number;
}

export interface Currency {
	id: string;
	name: string;
}

export interface Category {
	id: string;
	name: string;
}

export interface IBookPayload {
	id: string;
	name: string;
	categories: string[];
	language: string;
	price: number;
	currency: string;
	published: number;
	authors: string[];
	rating: number;
	user: string;
	description: string;
}

export interface ICategoryPayload {
	id: string;
	name: string;
}

export interface CurrencyRecord {
	id: string;
	name: string;
}

export interface CategoryRecord {
	id: string;
	name: string;
}

export interface BookRecord {
	id: string;
	name: string;
	language: string;
	price: number;
	published: number;
	currency: number;
	description: string;
	created_at: Date;
}

export interface Book_AuthorRecord {
	id: string;
	id_book: string;
	id_author: string;
}

export interface Category_BookRecord {
	id: string;
	id_book: string;
	id_category: string;
}
