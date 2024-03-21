import { Router, Request, Response, NextFunction } from "express";
import { CategoryController } from "../controllers/_index";
import {
	ICategoryRow,
	ICategoryCreatePayload,
	ICategoryEditPayload,
} from "../types/category/types";

export class CategoryRouter {
	private _router: Router;
	constructor(categoryController: CategoryController) {
		this._router = Router();

		// получить список книг
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

		//получить книгу по id сделано
		this._router.get(
			"/category/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const category = await categoryController.getCategory(req, res, next);
				res.send(category);
			}
		);

		//создать новую книгу
		this._router.post(
			"/category",
			async (
				req: Request<{}, {}, ICategoryCreatePayload>,
				res: Response,
				next
			) => {
				const category = await categoryController.postCategory(req, res, next);
				res.send(category);
			}
		);

		//отредактировать книгу  сделано
		this._router.patch(
			"/category/:id",
			async (
				req: Request<{ id: string }, {}, ICategoryEditPayload>,
				res: Response,
				next: NextFunction
			) => {
				const category = await categoryController.patchCategory(req, res, next);
				res.send(category);
			}
		);

		//удалить книгу
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
