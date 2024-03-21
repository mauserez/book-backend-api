import { Request, Response, NextFunction } from "express";
import { Controller } from "./Controller";
import { CategoryService } from "../services/_index";
import {
	ICategoryEditPayload,
	ICategoryCreatePayload,
} from "../types/category/types";

import { result } from "../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";

export class CategoryController extends Controller {
	private categoryService: CategoryService;

	constructor(categoryService: CategoryService) {
		super();
		this.categoryService = categoryService;
		console.log("Инициализация CategoryController");
	}

	async getCategories(
		req: Request<{}, {}, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		const categories = await this.categoryService.getCategories();
		return categories;
	}

	async getCategory(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		const id = !req.params.id ? undefined : req.params.id;

		if (id === undefined) {
			return result(false, "Category id is empty");
		} else {
			const category = await this.categoryService.getCategory(id);
			return category;
		}
	}

	async postCategory(
		req: Request<{}, {}, ICategoryCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		const newCategoryPayload = { ...req.body, id: uuidv4() };
		const result = await this.categoryService.editCategory(newCategoryPayload);
		return result;
	}

	async patchCategory(
		req: Request<{ id: string }, {}, ICategoryEditPayload>,
		res: Response,
		next: NextFunction
	) {
		const book = await this.categoryService.editCategory(req.body);

		return book;
	}

	async deleteCategory(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		return await this.categoryService.deleteCategory(req.params.id);
	}
}
