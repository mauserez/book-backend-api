import { Router, Request, Response, NextFunction } from "express";
import { AuthController } from "./AuthController";

export class AuthRouter {
	private _router: Router;
	constructor(authController: AuthController) {
		this._router = Router();

		//register
		this._router.post("/auth/register", async (req, res, next) => {
			const auth = await authController.register(req, res, next);
			res.send(auth);
		});

		//login
		this._router.post("/auth/login", async (req, res, next) => {
			const auth = await authController.login(req, res, next);
			res.send(auth);
		});
	}

	get router() {
		return this._router;
	}
}
