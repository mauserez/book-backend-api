import { ICategoryEditPayload, ICategorySavePayload } from "./types";
import { CategoryRepository } from "./CategoryRepository";
import { v4 as uuidv4 } from "uuid";

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

	public async saveCategories(categories: ICategorySavePayload[]) {
		const preparedCategories = categories.map((category) => {
			return {
				id: category.id || uuidv4(),
				name: category.name || "",
			};
		});

		return await this.categoryRepository.saveCategories(preparedCategories);
	}
}
