import { Router, Request, Response, NextFunction } from "express";
import { AuthorController } from "./AuthorController";
import { IAuthorCreatePayload, IAuthorEditPayload } from "./types";

export class AuthorRouter {
	private _router: Router;
	constructor(authorController: AuthorController) {
		this._router = Router();

		//все author
		this._router.get(
			"/authors",
			async (
				req: Request<{}, {}, {}, {}>,
				res: Response,
				next: NextFunction
			) => {
				const authors = await authorController.getAuthors(req, res, next);
				res.send(authors);
			}
		);

		//author по id
		this._router.get(
			"/author/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const author = await authorController.getAuthor(req, res, next);
				res.send(author);
			}
		);

		//добавить author
		this._router.post(
			"/author",
			async (
				req: Request<{}, {}, IAuthorCreatePayload>,
				res: Response,
				next
			) => {
				const result = await authorController.postAuthor(req, res, next);
				res.send(result);
			}
		);

		//отредактировать author
		this._router.patch(
			"/author",
			async (
				req: Request<{ id: string }, {}, IAuthorEditPayload>,
				res: Response,
				next: NextFunction
			) => {
				const result = await authorController.patchAuthor(req, res, next);
				res.send(result);
			}
		);

		//удалить author
		this._router.delete(
			"/author/:id",
			async (
				req: Request<{ id: string }>,
				res: Response,
				next: NextFunction
			) => {
				const result = await authorController.deleteAuthor(req, res, next);
				res.send(result);
			}
		);
	}

	get router() {
		return this._router;
	}
}
