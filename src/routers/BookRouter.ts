import { Router, Request, Response, NextFunction } from "express";
import {
	IBooksPayload,
	IBookEditPayload,
	IBookCreatePayload,
} from "../types/book/types";
import { BookController } from "../controllers/BookController";

export class BookRouter {
	private _router: Router;
	constructor(booksController: BookController) {
		this._router = Router();

		// получить список книг
		this._router.get(
			"/books",
			async (
				req: Request<{}, {}, {}, IBooksPayload>,
				res: Response,
				next: NextFunction
			) => {
				const books = await booksController.getBooks(req, res, next);
				res.send(books);
			}
		);

		//получить книгу по id сделано
		this._router.get(
			"/book/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const book = await booksController.getBook(req, res, next);
				res.send(book);
			}
		);

		//создать новую книгу
		this._router.post(
			"/book",
			async (req: Request<{}, {}, IBookCreatePayload>, res: Response, next) => {
				const book = await booksController.postBook(req, res, next);
				res.send(book);
			}
		);

		//отредактировать книгу  сделано
		this._router.patch(
			"/book/:id",
			async (
				req: Request<{ id: string }, {}, IBookEditPayload>,
				res: Response,
				next: NextFunction
			) => {
				const book = await booksController.patchBook(req, res, next);
				res.send(book);
			}
		);

		//удалить книгу
		this._router.delete(
			"/book/:id",
			async (
				req: Request<{ id: string }>,
				res: Response,
				next: NextFunction
			) => {
				const result = await booksController.deleteBook(req, res, next);
				res.send(result);
			}
		);
	}

	get router() {
		return this._router;
	}
}
