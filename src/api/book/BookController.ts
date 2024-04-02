import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";
import { BookService } from "./BookService";
import { IBookEditPayload, IBookCreatePayload, IBooksPayload } from "./types";

import { responseResult } from "../../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";

export class BookController extends Controller {
	private bookService: BookService;

	constructor(bookService: BookService) {
		super();
		this.bookService = bookService;
		console.log("Инициализация BooksController");
	}

	async getBooks(
		req: Request<{}, {}, {}, IBooksPayload>,
		res: Response,
		next: NextFunction
	) {
		const request = req.query;

		const limit = !request.limit ? 4 : Number(request.limit);
		const page = !request.page ? 1 : Number(request.page);
		const priceFrom = !!request.priceFrom ? Number(request.priceFrom) : 0;
		const priceTo = !!request.priceTo ? Number(request.priceTo) : 100000;
		const perPage = !!request.perPage;

		const category = !request.category
			? []
			: Array.isArray(request.category)
			? request.category
			: [request.category];

		const author = !request.author
			? []
			: Array.isArray(request.author)
			? request.author
			: [request.author];

		const options = {
			category: category,
			author: author,
			limit: limit,
			page: page,
			perPage: perPage,
			priceFrom: priceFrom,
			priceTo: priceTo,
		};

		const books = await this.bookService.getBooks(options);

		return books;
	}

	async getBook(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Book id is empty");
		}

		const book = await this.bookService.getBook(req.params.id);
		return book;
	}

	async postBook(
		req: Request<{}, {}, IBookCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		let key: keyof typeof req.body;

		for (key in req.body) {
			if (!req.body[key] && key !== "id") {
				return responseResult(false, `${key} is empty`);
			}
		}

		const newBookPayload = { ...req.body, id: uuidv4() };
		const result = await this.bookService.createBook(newBookPayload);
		return result;
	}

	async patchBook(
		req: Request<{ id: string }, {}, IBookEditPayload>,
		res: Response,
		next: NextFunction
	) {
		const book = await this.bookService.editBook(req.body);
		return book;
	}

	async deleteBook(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		return await this.bookService.deleteBook(req.params.id);
	}

	async getBookRating(
		req: Request<{}, {}, { id: string }>,
		res: Response,
		next: NextFunction
	) {
		if (!req.query.id) {
			return responseResult(false, "Book id is empty");
		}

		const book = await this.bookService.getBookRating(String(req.query.id));
		return book;
	}
}
