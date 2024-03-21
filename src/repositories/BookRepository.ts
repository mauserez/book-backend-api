import {
	IBookRow,
	IBookAuthorPayload,
	IBookEditPayload,
	IBookCategoryPayload,
} from "../types/book/types";

import { ICategoryRow } from "../types/category/types";
import { errorText, result } from "../helpers/resultHelper";
import prisma from "../prisma";

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
			const book: any = await prisma.book_view.findMany({
				//where: { id: bookId },
				orderBy: [{}],
			});

			return result<IBookRow | null>(true, book);
		} catch (error) {
			return result(false, errorText(error));
		}
	}

	public async getBook(bookId: string) {
		try {
			const book: any = await prisma.book_view.findUnique({
				where: { id: bookId },
			});

			return result<IBookRow | null>(true, book);
		} catch (error) {
			return result(false, errorText(error));
		}
	}

	public async saveBook(record: IBookEditPayload) {
		if (!record.authors.length || !record.categories.length) {
			return result(false, "Empty authors or categories");
		}

		try {
			const bookId = record.id;
			const authorIds = record.authors;
			const newBookAuthors = authorIds.map((authorId) => {
				return <IBookAuthorPayload>{
					author_id: authorId,
					book_id: bookId,
				};
			});

			const categoryIds = record.categories;
			const newBookCategories = categoryIds.map((categoryId) => {
				return <IBookCategoryPayload>{
					category_id: categoryId,
					book_id: bookId,
				};
			});

			const [upsert] = await prisma.$transaction([
				prisma.book.upsert({
					where: {
						id: bookId,
					},
					update: record,
					create: record,
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

			return result(true, "Success");
		} catch (error) {
			return result(false, errorText(error));
		}
	}

	public async deleteBook(bookId: string) {
		try {
			await prisma.book.delete({
				where: {
					id: bookId,
				},
			});

			return result(true, "Success");
		} catch (error) {
			return result(false, errorText(error));
		}
	}
}
