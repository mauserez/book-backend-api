import { Request, Response, NextFunction } from "express";
import { Controller } from "./Controller";

import { CategoryService } from "../services/_index";
import {
	ICategoryEditPayload,
	ICategoryCreatePayload,
} from "../types/category/types";

import { responseResult } from "../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";

export class CategoryController extends Controller {
	private categoryService: CategoryService;

	constructor(categoryService: CategoryService) {
		super();
		this.categoryService = categoryService;
	}

	async getCategories(
		req: Request<{}, {}, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		const result = await this.categoryService.getCategories();
		return result;
	}

	async getCategory(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		const id = !req.params.id ? undefined : req.params.id;

		if (id === undefined) {
			return responseResult(false, "Category id is empty");
		} else {
			const result = await this.categoryService.getCategory(id);
			return result;
		}
	}

	async postCategory(
		req: Request<{}, {}, ICategoryCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		const newCategoryPayload = { ...req.body, id: uuidv4() };

		const result = await this.categoryService.createCategory(
			newCategoryPayload
		);
		return result;
	}

	async patchCategory(
		req: Request<{ id: string }, {}, ICategoryEditPayload>,
		res: Response,
		next: NextFunction
	) {
		const result = await this.categoryService.editCategory(req.body);
		return result;
	}

	async deleteCategory(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		const result = await this.categoryService.deleteCategory(req.params.id);
		return result;
	}
}
