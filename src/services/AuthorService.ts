import { ICategoryEditPayload } from "../types/category/types";
import { CategoryRepository } from "../repositories/_index";

export class CategoryService {
	categoryRepository: CategoryRepository;

	constructor() {
		this.categoryRepository = new CategoryRepository();
	}

	public async getCategory(id: string) {
		const categoryResult = await this.categoryRepository.getCategory(id);
		return categoryResult;
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
