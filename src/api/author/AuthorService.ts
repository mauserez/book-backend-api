import { IAuthorCreatePayload, IAuthorEditPayload } from "./types";
import { AuthorRepository } from "./AuthorRepository";

export class AuthorService {
	authorRepository: AuthorRepository;

	constructor() {
		this.authorRepository = new AuthorRepository();
	}

	public async getAuthor(id: string) {
		return await this.authorRepository.getAuthor(id);
	}

	public async createAuthor(authorPayload: IAuthorCreatePayload) {
		return this.authorRepository.createAuthor(authorPayload);
	}

	public async editAuthor(authorPayload: IAuthorEditPayload) {
		return this.authorRepository.editAuthor(authorPayload);
	}

	public async deleteAuthor(id: string) {
		return await this.authorRepository.deleteAuthor(id);
	}

	public async getAuthors() {
		return await this.authorRepository.getAuthors();
	}
}
