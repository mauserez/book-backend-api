import {
	IAuthorCreatePayload,
	IAuthorEditPayload,
	IAuthorsSavePayload,
	IAuthorsSavePayloadRequired,
} from "./types";
import { AuthorRepository } from "./AuthorRepository";
import { v4 as uuidv4 } from "uuid";

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

	public async saveAuthors(authors: IAuthorsSavePayload) {
		const preparedAuthors = authors.map((author) => {
			return {
				id: author.id || uuidv4(),
				first_name: author.first_name || "",
				last_name: author.last_name || "",
				years_active: author.years_active || "",
			};
		});

		return await this.authorRepository.saveAuthors(preparedAuthors);
	}
}
