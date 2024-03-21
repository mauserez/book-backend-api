import { Router, Request, Response } from "express";
import { IRatingPayload } from "../types/rating/types";
import { BooksService, AuthService } from "../services/_index";

export class RaitingRouter {
	private _router: Router;

	constructor(booksService: BooksService, authService: AuthService) {
		this._router = Router();

		// проверка авторизации

		// добавить рейтинг
		this._router.post(
			"/rating",
			(req: Request<{}, {}, IRatingPayload[]>, res: Response) => {
				res.send(null);
			}
		);
	}
}

// Эндпоинты для рейтинга книг:
// POST /api/v1/rating — добавление рейтинга. Рейтинг не может быть добавлен, если пользователь не авторизован.
