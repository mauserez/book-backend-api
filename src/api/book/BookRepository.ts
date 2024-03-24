import {
	IBookRow,
	IBookAuthorPayload,
	IBookEditPayload,
	IBookCategoryPayload,
	IBookCreatePayload,
} from "./types";

import { ICategoryRow } from "../category/types";
import { errorText, responseResult } from "../../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../prisma";

export type GetBooksOptions = {
	category: ICategoryRow["id"][];
	limit: number;
	page: number;
	perPage: boolean;
};

export class BookRepository {
	public async getBooks(options: GetBooksOptions) {
		const condition = {};

		try {
			const books: any = await prisma.book_view.findMany({
				//where: { id: bookId },
				//orderBy: [{}],
			});

			console.log(books);

			return responseResult<IBookRow | null>(true, books);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async getBook(bookId: string) {
		try {
			const book: any = await prisma.book_view.findUnique({
				where: { id: bookId },
			});

			return responseResult<IBookRow | null>(true, book);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async createBook(newBook: IBookCreatePayload) {
		if (!newBook.author?.length || !newBook.category?.length) {
			return responseResult(false, "Empty authors or categories");
		}

		try {
			console.log(newBook);

			const bookId = uuidv4();
			const newBookAuthors = await this.collectAuthors(bookId, newBook.author);
			const newBookCategories = await this.collectCategories(
				bookId,
				newBook.category
			);

			const book = { ...newBook, id: bookId };

			await prisma.$transaction([
				prisma.book.create({
					data: {
						id: book.id,
						name: book.name,
						description: book.description,
						language: book.language,
						price: book.price,
						currency_id: book.currency_id,
					},
				}),
				prisma.book_authors.deleteMany({
					where: {
						book_id: bookId,
					},
				}),
				prisma.book_authors.createMany({
					data: newBookAuthors,
				}),
				prisma.book_categories.deleteMany({
					where: {
						book_id: bookId,
					},
				}),
				prisma.book_categories.createMany({
					data: newBookCategories,
				}),
			]);

			return responseResult(true, bookId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async editBook(book: IBookEditPayload) {
		if (!book.id) {
			return responseResult(false, "Empty id");
		}

		try {
			const bookId = book.id;
			const authorIds = book.author;

			await prisma.book.update({
				where: {
					id: book.id,
				},
				data: {
					name: book.name || undefined,
					description: book.description || undefined,
					language: book.language || undefined,
					price: book.price || undefined,
					currency_id: book.currency_id || undefined,
				},
			});

			if (authorIds) {
				const newBookAuthors = authorIds.map((authorId) => {
					return <IBookAuthorPayload>{
						author_id: authorId,
						book_id: bookId,
					};
				});

				await prisma.$transaction([
					prisma.book_authors.deleteMany({
						where: {
							book_id: bookId,
						},
					}),

					prisma.book_authors.createMany({
						data: newBookAuthors,
					}),
				]);
			}

			const categoryIds = book.category;
			if (categoryIds) {
				const newBookCategories = categoryIds.map((categoryId) => {
					return <IBookCategoryPayload>{
						category_id: categoryId,
						book_id: bookId,
					};
				});

				await prisma.$transaction([
					prisma.book_categories.deleteMany({
						where: {
							book_id: bookId,
						},
					}),

					prisma.book_categories.createMany({
						data: newBookCategories,
					}),
				]);
			}

			return responseResult(true, bookId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	private async collectAuthors(
		bookId: string,
		authorIds: IBookCreatePayload["author"]
	) {
		if (!authorIds) {
			return [];
		}

		return authorIds.map((authorId) => {
			return <IBookAuthorPayload>{
				author_id: authorId,
				book_id: bookId,
			};
		});
	}

	private async collectCategories(
		bookId: string,
		categoryIds: IBookCreatePayload["category"]
	) {
		if (!categoryIds) {
			return [];
		}

		return categoryIds.map((categoryId) => {
			return <IBookCategoryPayload>{
				category_id: categoryId,
				book_id: bookId,
			};
		});
	}

	public async deleteBook(bookId: string) {
		try {
			await prisma.book.delete({
				where: {
					id: bookId,
				},
			});

			return responseResult(true, "Deleted");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
