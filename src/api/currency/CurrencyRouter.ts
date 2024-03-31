import { Router, Request, Response, NextFunction } from "express";
import { CurrencyController } from "./CurrencyController";
import { ICurrencyCreatePayload, ICurrencyEditPayload } from "./types";
import { AuthMiddleware } from "../../core/middleware";

export class CurrencyRouter {
	private _router: Router;
	constructor(
		currencyController: CurrencyController,
		authMiddleware: AuthMiddleware
	) {
		this._router = Router();

		//все currency
		this._router.get(
			"/currencies",
			async (
				req: Request<{}, {}, {}, {}>,
				res: Response,
				next: NextFunction
			) => {
				const currencys = await currencyController.getCurrencies(
					req,
					res,
					next
				);
				res.send(currencys);
			}
		);

		//currency по id
		this._router.get(
			"/currency/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const currency = await currencyController.getCurrency(req, res, next);
				res.send(currency);
			}
		);

		//добавить currency
		this._router.post(
			"/currency",
			authMiddleware.verifyAuth,
			async (
				req: Request<{}, {}, ICurrencyCreatePayload>,
				res: Response,
				next
			) => {
				const result = await currencyController.postCurrency(req, res, next);
				res.send(result);
			}
		);

		//отредактировать currency
		this._router.patch(
			"/currency",
			authMiddleware.verifyAuth,
			async (
				req: Request<{ id: string }, {}, ICurrencyEditPayload>,
				res: Response,
				next: NextFunction
			) => {
				const result = await currencyController.patchCurrency(req, res, next);
				res.send(result);
			}
		);

		//удалить currency
		this._router.delete(
			"/currency/:id",
			authMiddleware.verifyAuth,
			async (
				req: Request<{ id: string }>,
				res: Response,
				next: NextFunction
			) => {
				const result = await currencyController.deleteCurrency(req, res, next);
				res.send(result);
			}
		);
	}

	get router() {
		return this._router;
	}
}
