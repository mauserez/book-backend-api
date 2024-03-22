import { UserRepository } from "./UserRepository";
import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { UserService } from "./UserService";
import { IUserEditPayload, IUserCreatePayload } from "./types";

import { responseResult } from "../../helpers/resultHelper";
import bcrypt from "bcrypt";

export class UserController extends Controller {
	private userService: UserService;
	private userRepository: UserRepository;

	constructor(userService: UserService, userRepository: UserRepository) {
		super();
		this.userService = userService;
		this.userRepository = userRepository;
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

	async postUser(
		req: Request<{}, {}, IUserCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.login || req.body.password) {
			return responseResult(false, "Field login or password is empty");
		}

		let { login, password } = req.body;

		const searchedUser = await this.userRepository.getUserByLogin(login.trim());

		if (searchedUser.success && searchedUser.result) {
			return responseResult(false, "User already exists");
		}

		password = await bcrypt.hash(password, 10);

		const newUserPayload = { login, password };

		const result = await this.userService.createUser(newUserPayload);

		return result;
	}

	async patchUser(
		req: Request<{ id: string }, {}, IUserEditPayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.id) {
			return responseResult(false, "Field id is empty");
		}

		const result = await this.userService.editUser(req.body);
		return result;
	}

	async deleteUser(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.userService.deleteUser(req.params.id);
		return result;
	}
}
