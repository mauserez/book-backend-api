import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { CategoryService } from "./CategoryService";
import { ICategoryEditPayload, ICategoryCreatePayload } from "./types";

import { responseResult } from "../../helpers/resultHelper";
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
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.categoryService.getCategory(req.params.id);
		return result;
	}

	async postCategory(
		req: Request<{}, {}, ICategoryCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.name) {
			return responseResult(false, "Field name is empty");
		}

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
		if (!req.body.name || !req.body.id) {
			return responseResult(false, "Field id and name is empty");
		}

		const result = await this.categoryService.editCategory(req.body);
		return result;
	}

	async deleteCategory(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.categoryService.deleteCategory(req.params.id);
		return result;
	}
}
