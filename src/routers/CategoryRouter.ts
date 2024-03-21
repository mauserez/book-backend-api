import { Router, Request, Response } from "express";
import { ICategoryPayload } from "../types/category/types";
import { categoryPlaceholder } from "../placeholders";
import { BooksService } from "../services/BooksService";
import { AuthService } from "../services/AuthService";
export class CategoryRouter {
	private _router: Router;

	constructor(booksService: BooksService, authService: AuthService) {
		this._router = Router();

		// получить список категорий
		this._router.get(
			"/categories",
			(req: Request<{ perPage: number; page: boolean }>, res: Response) => {
				res.send(categoryPlaceholder);
			}
		);

		// добавить категорию
		this._router.post(
			"/categories",
			(req: Request<{}, {}, {}, ICategoryPayload[]>, res: Response) => {
				res.send(categoryPlaceholder);
			}
		);

		// получить категорию по id
		this._router.get("categories/:id", (req: Request<{ id: string }>, res) => {
			res.send(categoryPlaceholder);
		});

		// редактировать категорию  тело  -  это структура полей и значений к редактированию
		this._router.patch(
			"/categories/:id",
			(
				req: Request<{ id: string }, {}, [{ field: string; value: any }]>,
				res: Response
			) => {
				res.send(categoryPlaceholder);
			}
		);

		// удалить категорию
		this._router.delete(
			"/categories/:id",
			(req: Request<{}, {}, {}>, res: Response) => {
				res.send(categoryPlaceholder);
			}
		);
	}
}