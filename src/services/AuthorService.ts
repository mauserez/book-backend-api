import {
	IAuthorCreatePayload,
	IAuthorEditPayload,
} from "../types/author/types";
import { AuthorRepository } from "../repositories/_index";

export class AuthorService {
	categoryRepository: AuthorRepository;

	constructor() {
		this.categoryRepository = new AuthorRepository();
	}

	public async getAuthor(id: string) {
		return await this.categoryRepository.getAuthor(id);
	}

	public async createAuthor(categoryPayload: IAuthorCreatePayload) {
		return this.categoryRepository.createAuthor(categoryPayload);
	}

	public async editAuthor(categoryPayload: IAuthorEditPayload) {
		return this.categoryRepository.editAuthor(categoryPayload);
	}

	public async deleteAuthor(id: string) {
		return await this.categoryRepository.deleteAuthor(id);
	}

	public async getCategories() {
		return await this.categoryRepository.getCategories();
	}
}
