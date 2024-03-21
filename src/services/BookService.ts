import { IBookEditPayload } from "../types/book/types";
import { BookRepository } from "../repositories/_index";
import { GetBooksOptions } from "../repositories/BookRepository";

export class BookService {
	bookRepository: BookRepository;

	constructor() {
		this.bookRepository = new BookRepository();
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
		return await this.bookRepository.getBooks(options);
	}
}
