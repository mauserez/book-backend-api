import { UserRepository } from "./UserRepository";
import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { UserService } from "./UserService";
import { IUserEditPayload, IUserLogin, IUserRegister } from "./types";

import { responseResult } from "../../helpers/resultHelper";
import { verify } from "jsonwebtoken";

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

	async register(
		req: Request<{}, {}, IUserRegister>,
		res: Response,
		next: NextFunction
	) {
		const { login, password } = req.body;
		console.log(req.body);
		if (!login || !password) {
			return responseResult(false, "Field login or password is empty");
		}

		const result = await this.userService.register({ login, password });
		return result;
	}

	async login(
		req: Request<{}, {}, IUserLogin>,
		res: Response,
		next: NextFunction
	) {
		const { login, password } = req.body;
		if (!login || !password) {
			return responseResult(false, "Field login or password is empty");
		}

		const result = await this.userService.login({ login, password });
		return result;
	}
}
