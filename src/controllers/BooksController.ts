import { Request, Response, NextFunction } from "express";
import { Controller } from "./Controller";
import { BooksService } from "../services/_index";
import {
	IBookEditPayload,
	IBookCreatePayload,
	IBooksPayload,
} from "../types/book/types";

import { result } from "../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";

export class BooksController extends Controller {
	private booksService: BooksService;

	constructor(booksService: BooksService) {
		super();
		this.booksService = booksService;
		console.log("Инициализация BooksController");
	}

	async getBooks(
		req: Request<{}, {}, {}, IBooksPayload>,
		res: Response,
		next: NextFunction
	) {
		const request = req.query;

		const limit = !request.limit ? 10 : Number(request.limit);
		const page = !request.page ? 1 : Number(request.page);
		const perPage = !!request.perPage;
		const category = !req.query.category ? [] : req.query.category;

		const options = {
			category: category,
			limit: limit,
			page: page,
			perPage: perPage,
		};

		const books = await this.booksService.getBooks(options);

		return books;
	}

	async getBook(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		const id = !req.params.id ? undefined : req.params.id;

		if (id === undefined) {
			return result(false, "Book id is empty");
		} else {
			const book = await this.booksService.getBook(id);
			return book;
		}
	}

	async postBook(
		req: Request<{}, {}, IBookCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		const newBookPayload = { ...req.body, id: uuidv4() };
		const book = await this.booksService.editBook(newBookPayload);
		return book;
	}

	async patchBook(
		req: Request<{ id: string }, {}, IBookEditPayload>,
		res: Response,
		next: NextFunction
	) {
		const book = await this.booksService.editBook(req.body);

		return book;
	}

	async deleteBook(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		return await this.booksService.deleteBook(req.params.id);
	}
}