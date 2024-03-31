import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { UserService } from "./UserService";
import { IUserEditPayload, IUserFavoritePayload } from "./types";

import { responseResult } from "../../helpers/resultHelper";

export class UserController extends Controller {
	private userService: UserService;

	constructor(userService: UserService) {
		super();
		this.userService = userService;
	}

	async getUsers(
		req: Request<{}, {}, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		const result = await this.userService.getUsers();
		return result;
	}

	async getUser(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.userService.getUser(req.params.id);
		return result;
	}

	async patchUser(
		req: Request<{}, {}, IUserEditPayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.id) {
			return responseResult(false, "Field id is empty");
		}

		const result = await this.userService.editUser(req.body);
		return result;
	}

	/* async deleteUser(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.userService.deleteUser(req.params.id);
		return result;
	} */

	async toggleFavorite(
		req: Request<{}, {}, { id: string }>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.id) {
			return responseResult(false, "Field id is empty");
		}

		const { id } = req.body;
		const favObject = { book_id: id, user_id: res.locals.userId };

		const result = await this.userService.toggleFavorite(favObject);
		return result;
	}

	async isFavorite(
		req: Request<{}, {}, { id: string }>,
		res: Response,
		next: NextFunction
	) {
		if (!req.query.id) {
			return responseResult(false, "Field id is empty");
		}

		const { id } = req.query;
		const favObject = { book_id: String(id), user_id: res.locals.userId };

		const result = await this.userService.isFavorite(favObject);
		return result;
	}
}
