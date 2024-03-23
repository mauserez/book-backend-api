import { Request, Response, NextFunction } from "express";
import { Middleware } from "../Controller";
import { verify, JwtPayload } from "jsonwebtoken";
import { responseResult } from "../../helpers/resultHelper";
export class AuthMiddleware extends Middleware {
	constructor() {
		super();
	}

	public verifyAuth(req: Request, res: Response, next: NextFunction) {
		if (!req.headers.authorization) {
			return res.status(401).send(responseResult(false, "Bearer JWT is empty"));
		}

		const token = req.headers.authorization.split(" ")[1];

		verify(token, <string>process.env.JWTSECRET, (err, payload) => {
			if (err) {
				console.log("verify err", err);
				res.status(401).send(responseResult(false, err.message));
			} else {
				const pay: JwtPayload = <JwtPayload>payload;

				if (pay.exp === undefined) {
					next();
				} else if (new Date().getMilliseconds() <= pay.exp) {
					next();
				} else {
					res.status(401).send(responseResult(false, "Bearer JWT is expired"));
				}
			}
		});
	}
}
