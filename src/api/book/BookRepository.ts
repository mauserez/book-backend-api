import {
	IBookRow,
	IBookAuthorPayload,
	IBookEditPayload,
	IBookCategoryPayload,
	IBookCreatePayload,
	IBookRating,
} from "./types";

import { ICategoryRow } from "../category/types";
import { errorText, responseResult } from "../../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../prisma";
import { IAuthorRow } from "../author/types";

export type GetBooksOptions = {
	category: ICategoryRow["id"][];
	author: IAuthorRow["id"][];
	limit: number;
	page: number;
	perPage: boolean;
	priceFrom: number;
	priceTo: number;
};

export type GetBooksResult = {
	books: IBookRow[];
	bookCount: number;
	pageCount: number;
};

export type WhereCondition = {
	price: {};
	book_categories?: {};
};

export const BOOKS_SELECT = {
	id: true,
	name: true,
	price: true,
	language: true,
	description: true,
	book_authors: {
		select: {
			author_id: true,
			author: {
				select: {
					last_name: true,
					first_name: true,
				},
			},
		},
	},
	book_categories: {
		select: {
			category_id: true,
			category: {
				select: {
					name: true,
				},
			},
		},
	},
};

export class BookRepository {
	public async getBooks(options: GetBooksOptions) {
		const { limit, category, author, page, perPage, priceFrom, priceTo } =
			options;
		const take = limit;
		const skip = (page - 1) * take;

		try {
			const books: any = await prisma.book.findMany({
				skip: skip,
				take: take,
				select: BOOKS_SELECT,
				where: {
					price: { gte: priceFrom, lte: priceTo },
					book_categories: {
						some: {
							category_id:
								category.length > 0
									? { in: category.map((category) => category) }
									: {},
						},
					},
					book_authors: {
						some: {
							author_id:
								author.length > 0 ? { in: author.map((author) => author) } : {},
						},
					},
				},
				orderBy: [{ price: "asc" }],
			});

			const bookCount = await prisma.book.count({
				where: {
					price: { gte: priceFrom, lte: priceTo },
					book_categories: {
						some: {
							category_id:
								category.length > 0
									? { in: category.map((category) => category) }
									: {},
						},
					},
					book_authors: {
						some: {
							author_id:
								author.length > 0 ? { in: author.map((author) => author) } : {},
						},
					},
				},
			});

			const pageCount = Math.ceil(bookCount / take);

			return responseResult<GetBooksResult | null>(true, {
				books,
				bookCount,
				pageCount,
			});
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

	public async getBookRating(bookId: string) {
		try {
			const book = await prisma.rating.aggregate({
				_avg: {
					value: true,
				},
				_count: true,
				where: { id: bookId },
			});

			const result = {
				rating: Number(book._avg),
				reviews: Number(book._count),
			};

			return responseResult<IBookRating | null>(true, result);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
