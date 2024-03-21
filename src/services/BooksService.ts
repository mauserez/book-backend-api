import {
	IBook,
	IBookCreatePayload,
	IBookEditPayload,
	IBookRow,
} from "../types/book/types";

import { BookRepository } from "../repositories/_index";
import { UserService } from "./_index";
import { Category } from "../types/category/types";
import { GetBooksOptions } from "../repositories/BookRepository";

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

	public async editBook(bookPayload: IBookEditPayload) {
		return this.bookRepository.saveBook(bookPayload);
	}

	public async createBook(bookPayload: IBookEditPayload) {
		return this.bookRepository.saveBook(bookPayload);
	}

	public async deleteBook(id: string) {
		return await this.bookRepository.deleteBook(id);
	}

	public async getBooks(options: GetBooksOptions) {
		const books = await this.bookRepository.getBooks(options);
		return { success: true, result: books };
	}
}
