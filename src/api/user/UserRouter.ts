import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "./UserController";
import { IUserEditPayload } from "./types";

export class UserRouter {
	private _router: Router;
	constructor(userController: UserController) {
		this._router = Router();

		//все user
		this._router.get(
			"/users",
			async (
				req: Request<{}, {}, {}, {}>,
				res: Response,
				next: NextFunction
			) => {
				const users = await userController.getUsers(req, res, next);
				res.send(users);
			}
		);

		//user по id
		this._router.get(
			"/user/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const user = await userController.getUser(req, res, next);
				res.send(user);
			}
		);

		//отредактировать user
		this._router.patch(
			"/user",
			async (
				req: Request<{ id: string }, {}, IUserEditPayload>,
				res: Response,
				next: NextFunction
			) => {
				req.body.id = res.locals.userId;
				const result = await userController.patchUser(req, res, next);
				res.send(result);
			}
		);

		//удалить user
		/* this._router.delete(
			"/user/:id",
			async (
				req: Request<{ id: string }>,
				res: Response,
				next: NextFunction
			) => {
				const result = await userController.deleteUser(req, res, next);
				res.send(result);
			}
		); */

		/* this._router.post("/user/books", async (req, res, next) => {
			const books = await userController.login(req, res, next);
			res.send([]);
		}); */

		this._router.get("/user-books", async (req, res, next) => {
			const result = await userController.userBooks(req, res, next);
			res.send(result);
		});

		this._router.post("/user-books/toggle-favorite", async (req, res, next) => {
			const result = await userController.toggleFavorite(req, res, next);
			res.send(result);
		});

		this._router.get("/user-books/is-favorite", async (req, res, next) => {
			const result = await userController.isFavorite(req, res, next);
			res.send(result);
		});
	}

	get router() {
		return this._router;
	}
}
