import {
	IBook,
	IBookRow,
	//IBook_AuthorRecord,
	//IBookPayload,
} from "../types/book/types";

import {
	Category,
	CategoryRow,
	//Category_BookRow,
} from "../types/category/types";

import { Currency, CurrencyRow } from "../types/currency/types";
import { Author, AuthorRecord } from "../types/author/types";
import { Rating, RatingRecord, IRatingPayload } from "../types/rating/types";

import { BookRepository } from "../repositories/_index";
import { UserService } from "./_index";

import { v4 as uuidv4 } from "uuid";

import { getIdArray, getIdArrayCategory, getIdArrayAutor } from "../utils";
import { result } from "../helpers/resultHelper";

export class BooksService {
	bookRepository: BookRepository;
	userService: UserService;

	constructor() {
		this.bookRepository = new BookRepository();
		this.userService = new UserService();
	}

	public async getBook(id: string) {
		const bookResult = await this.bookRepository.getBook(id);
		return bookResult;
	}

	/* public async getBooks(
		perPage: boolean | undefined,
		page: number | undefined,
		categoriesString: string[],
		limit: number | undefined
	) {
		const book = await this.rowRepository.getRow();

		return { success: true, result: books };
	} */

	/* public async editBook(
		bookId: string,
		bookData: IBookPayload
	): Promise<{ success: boolean; result: Book }> {
		return { success: true, result: book };
	}

	public async createBooks(bookData: IBookPayload[]): Promise<{
		success: boolean;
		result: { success: boolean; bookId: string; book: Book }[];
	}> {
		return { success: true, result: result };
	} */

	// колбеки и обработка результатов каскадного добавления
	// создать валюту
	public async createCurrency(
		currencyData: string
	): Promise<{ success: boolean; result: Currency }> {
		//    let currency: Currency ;
		return await postRow("currency", {
			id: uuidv4(),
			name: currencyData,
		}).then(
			(data) => {
				if (data.success) {
					let currencyRecord: CurrencyRow = <CurrencyRow>data.result;
					// console.log("value_currency", data)
					return {
						success: true,
						result: { id: currencyRecord.id, name: currencyRecord.name },
					};
				} else {
					return { success: false, result: <Currency>{} };
				}
			},
			(error) => {
				// console.log("error_currency", error)
				return { success: false, result: <Currency>{} };
			}
		);
	}
	// создать категорию
	public async createCategory(
		categoryData: string[]
	): Promise<{ success: boolean; result: Category[] }> {
		// добавить категории   проверить может есть такая
		let categories: Category[] = [];
		for (let index = 0; index < categoryData.length; index++) {
			const category = categoryData[index];

			let result = await this.bookRepository
				.postRecord("category", {
					id: uuidv4(),
					name: category,
				})
				.then(
					(data) => {
						let categoryRecord: CategoryRow = <CategoryRow>data.result;

						// console.log("value_category", data)
						return {
							success: true,
							result: <Category>{
								id: categoryRecord.id,
								name: categoryRecord.name,
							},
						};
					},
					(error) => {
						// console.log("error_category", error)
						return { success: false, result: <Category>{} };
					}
				);
			if (result?.success)
				categories.push({ id: result.result.id, name: result.result.name });
		}
		return { success: true, result: categories };
	}

	// создать Авторов
	public async createAuthor(
		authorData: string[]
	): Promise<{ success: boolean; result: Author[] }> {
		let authors: Author[] = [];

		for (let index = 0; index < authorData.length; index++) {
			const author = authorData[index];
			let result = await this.bookRepository
				.postRecord("author", {
					id: uuidv4(),
					name: author,
					birth: 0,
					death: 0,
				})
				.then(
					(data) => {
						if (data.success) {
							let authorRecord: AuthorRecord = <AuthorRecord>data.result;
							// console.log("value_author", data)
							return {
								success: true,
								result: <Author>{
									id: authorRecord.id,
									name: authorRecord.name,
									birth: authorRecord.birth,
									death: authorRecord.death,
								},
							};
						}
					},
					(error) => {
						console.log("error_author", error);
						return { success: false, result: <Author>{} };
					}
				);
			if (result?.success)
				authors.push({
					id: result.result.id,
					name: result.result.name,
					birth: result.result.birth,
					death: result.result.death,
				});
		}
		return { success: true, result: authors };
	}
	// создать рейтинг
	public async createRaiting(
		raitingData: IRatingPayload
	): Promise<{ success: boolean; result: Rating | undefined }> {
		let resultUser = await this.userService.getUser(raitingData.user);
		if (!resultUser.success) return { success: false, result: undefined };
		if (resultUser.result === undefined)
			return { success: false, result: undefined };

		let user = resultUser.result;

		// добавить рейтинг
		return this.bookRepository
			.postRecord("raiting", {
				id: uuidv4(),
				id_user: user.id,
				value: raitingData.rating,
				id_book: raitingData.book.id,
			})
			.then(
				(data) => {
					let raitingkRecord: RatingRecord = <RatingRecord>data.result;
					// console.log("value_raiting", data)
					return {
						success: true,
						result: {
							id: raitingkRecord.id,
							book: raitingData.book,
							user: user,
							value: raitingkRecord.value,
						},
					};
				},
				(error) => {
					console.log("error_raiting", error);
					return { success: false, result: undefined };
				}
			);
	}
	// cоздать связь Книга_категория
	public async createCategoryBook(
		bookId: string,
		categoryIds: string[]
	): Promise<{ success: boolean; result: Category_BookRow[] }> {
		let relations: Category_BookRow[] = [];

		for (let index = 0; index < categoryIds.length; index++) {
			const categoryId = categoryIds[index];

			await this.bookRepository
				.postRecord("category_book", {
					id: uuidv4(),
					id_book: bookId,
					id_category: categoryId,
				})
				.then((data) => {
					if (data.success) {
						let categoryBookRecord = <Category_BookRow>data.result;
						relations.push({
							id: categoryBookRecord.id,
							id_book: bookId,
							id_category: categoryBookRecord.id_category,
						});
					}
				});
		}
		return { success: true, result: relations };
	}

	// cоздать связь Книга_Автор
	public async createBookAuthor(
		bookId: string,
		autorsIds: string[]
	): Promise<{ success: boolean; result: Book_AuthorRecord[] }> {
		let relations: Book_AuthorRecord[] = [];

		for (let index = 0; index < autorsIds.length; index++) {
			const authorId = autorsIds[index];

			await this.bookRepository
				.postRecord("book_author", {
					id: uuidv4(),
					id_book: bookId,
					id_author: authorId,
				})
				.then((data) => {
					if (data.success) {
						let bookAuthorRecord = <Book_AuthorRecord>data.result;
						relations.push({
							id: bookAuthorRecord.id,
							id_book: bookId,
							id_author: bookAuthorRecord.id_author,
						});
					}
				});
		}
		return { success: true, result: relations };
	}

	public async deleteBook(id: string) {
		return await this.bookRepository.deleteBook(id);
	}
}
