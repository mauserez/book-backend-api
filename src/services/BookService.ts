import { IBookCreatePayload, IBookEditPayload } from "../types/book/types";
import { BookRepository } from "../repositories/_index";
import { GetBooksOptions } from "../repositories/BookRepository";

export class BookService {
	bookRepository: BookRepository;

	constructor() {
		this.bookRepository = new BookRepository();
	}

	public async getBook(id: string) {
		return await this.bookRepository.getBook(id);
	}

	public async editBook(bookPayload: IBookEditPayload) {
		return this.bookRepository.editBook(bookPayload);
	}

	public async createBook(bookPayload: IBookCreatePayload) {
		return this.bookRepository.createBook(bookPayload);
	}

	public async deleteBook(id: string) {
		return await this.bookRepository.deleteBook(id);
	}

	public async getBooks(options: GetBooksOptions) {
		return await this.bookRepository.getBooks(options);
	}
}
