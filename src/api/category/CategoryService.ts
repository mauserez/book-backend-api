import { ICategoryEditPayload } from "./types";
import { CategoryRepository } from "./CategoryRepository";

export class CategoryService {
	categoryRepository: CategoryRepository;

	constructor() {
		this.categoryRepository = new CategoryRepository();
	}

	public async getCategory(id: string) {
		return await this.categoryRepository.getCategory(id);
	}

	public async editCategory(categoryPayload: ICategoryEditPayload) {
		return this.categoryRepository.saveCategory(categoryPayload);
	}

	public async createCategory(categoryPayload: ICategoryEditPayload) {
		return this.categoryRepository.saveCategory(categoryPayload);
	}

	public async deleteCategory(id: string) {
		return await this.categoryRepository.deleteCategory(id);
	}

	public async getCategories() {
		return await this.categoryRepository.getCategories();
	}
}
