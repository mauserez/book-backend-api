import { IBookCreatePayload, IBookEditPayload } from "./types";
import { BookRepository, GetBooksOptions } from "./BookRepository";

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

	public async getBookRating(id: string) {
		return await this.bookRepository.getBookRating(id);
	}
}
