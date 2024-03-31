import { Router, Request, Response, NextFunction } from "express";
import { CategoryController } from "./CategoryController";
import { ICategoryCreatePayload, ICategoryEditPayload } from "./types";
import { AuthMiddleware } from "../../core/middleware";

export class CategoryRouter {
	private _router: Router;
	constructor(
		categoryController: CategoryController,
		authMiddleware: AuthMiddleware
	) {
		this._router = Router();

		//все category
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

		//category по id
		this._router.get(
			"/category/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const category = await categoryController.getCategory(req, res, next);
				res.send(category);
			}
		);

		//добавить category
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

		//отредактировать category
		this._router.patch(
			"/category",
			async (
				req: Request<{ id: string }, {}, ICategoryEditPayload>,
				res: Response,
				next: NextFunction
			) => {
				const result = await categoryController.patchCategory(req, res, next);
				res.send(result);
			}
		);

		//удалить category
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
