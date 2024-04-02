import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { AuthorService } from "./AuthorService";
import {
	IAuthorEditPayload,
	IAuthorCreatePayload,
	IAuthorsSavePayload,
} from "./types";

import { responseResult } from "../../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";

export class AuthorController extends Controller {
	private authorService: AuthorService;

	constructor(authorService: AuthorService) {
		super();
		this.authorService = authorService;
	}

	async getAuthors(
		req: Request<{}, {}, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		const result = await this.authorService.getAuthors();
		return result;
	}

	async postAuthors(
		req: Request<{}, {}, IAuthorsSavePayload>,
		res: Response,
		next: NextFunction
	) {
		const authors = req.body;
		authors.map((author) => {
			const { first_name, last_name } = author;
			if (!first_name || !last_name) {
				return responseResult(
					false,
					"Field first_name or last_name is empty, years_active is not required"
				);
			}
		});

		const result = await this.authorService.saveAuthors(authors);
		return result;
	}

	async getAuthor(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.authorService.getAuthor(req.params.id);
		return result;
	}

	async postAuthor(
		req: Request<{}, {}, IAuthorCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		const { first_name, last_name } = req.body;
		if (!first_name || !last_name) {
			return responseResult(
				false,
				"Field first_name or last_name is empty, years_active is not required"
			);
		}

		const result = await this.authorService.createAuthor(req.body);
		return result;
	}

	async patchAuthor(
		req: Request<{}, {}, IAuthorEditPayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.id) {
			return responseResult(false, "Field id is empty");
		}

		const result = await this.authorService.editAuthor(req.body);
		return result;
	}

	async deleteAuthor(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.authorService.deleteAuthor(req.params.id);
		return result;
	}
}
