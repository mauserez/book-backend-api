import { IBook } from "./types/book/types";
import { Category } from "./types/category/types";

export const booksPlaceholder: IBook = {
	id: "1",
	name: "book1",
	language: "RU",
	price: 111,
	currencyAcronym: "USD",
	description: "",
	ratingCount: 50,
	ratingValue: 77,
};

export const categoryPlaceholder: Category = { "id": "1", "name": "user" };
export const token = "34154w765e68fpy9g";
