import { Router, Request, Response, NextFunction } from "express";
import { CategoryController } from "../controllers/_index";
import {
	ICategoryCreatePayload,
	ICategoryEditPayload,
} from "../types/category/types";

export class CategoryRouter {
	private _router: Router;
	constructor(categoryController: CategoryController) {
		this._router = Router();

		//все категории
		this._router.get(
			"/categories",
			async (
				req: Request<{}, {}, {}, {}>,
				res: Response,
				next: NextFunction
			) => {
				const categories = await categoryController.getCategories(
					req,
					res,
					next
				);
				res.send(categories);
			}
		);

		//категория по id
		this._router.get(
			"/category/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const category = await categoryController.getCategory(req, res, next);
				res.send(category);
			}
		);

		//добавить категорию
		this._router.post(
			"/category",
			async (
				req: Request<{}, {}, ICategoryCreatePayload>,
				res: Response,
				next
			) => {
				const result = await categoryController.postCategory(req, res, next);
				res.send(result);
			}
		);

		//отредактировать категорию
		this._router.patch(
			"/category/:id",
			async (
				req: Request<{ id: string }, {}, ICategoryEditPayload>,
				res: Response,
				next: NextFunction
			) => {
				const result = await categoryController.patchCategory(req, res, next);
				res.send(result);
			}
		);

		//удалить категорию
		this._router.delete(
			"/category/:id",
			async (
				req: Request<{ id: string }>,
				res: Response,
				next: NextFunction
			) => {
				const result = await categoryController.deleteCategory(req, res, next);
				res.send(result);
			}
		);
	}

	get router() {
		return this._router;
	}
}
