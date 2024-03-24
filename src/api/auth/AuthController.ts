import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { AuthService } from "./AuthService";
import { IAuthLogin, IAuthRegister } from "./types";

import { responseResult } from "../../helpers/resultHelper";

export class AuthController extends Controller {
	private authService: AuthService;

	constructor(authService: AuthService) {
		super();
		this.authService = authService;
	}

	async register(
		req: Request<{}, {}, IAuthRegister>,
		res: Response,
		next: NextFunction
	) {
		const { login, password } = req.body;

		if (!login || !password) {
			return responseResult(false, "Field login or password is empty");
		}

		const result = await this.authService.register({ login, password });
		return result;
	}

	async login(
		req: Request<{}, {}, IAuthLogin>,
		res: Response,
		next: NextFunction
	) {
		const { login, password } = req.body;
		if (!login || !password) {
			return responseResult(false, "Field login or password is empty");
		}

		const result = await this.authService.login({ login, password });
		return result;
	}
}
