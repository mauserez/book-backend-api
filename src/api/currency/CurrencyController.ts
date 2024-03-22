import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { CurrencyService } from "./CurrencyService";
import { ICurrencyEditPayload, ICurrencyCreatePayload } from "./types";

import { responseResult } from "../../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";

export class CurrencyController extends Controller {
	private currencyService: CurrencyService;

	constructor(currencyService: CurrencyService) {
		super();
		this.currencyService = currencyService;
	}

	async getCurrencies(
		req: Request<{}, {}, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		const result = await this.currencyService.getCurrencies();
		return result;
	}

	async getCurrency(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.currencyService.getCurrency(req.params.id);
		return result;
	}

	async postCurrency(
		req: Request<{}, {}, ICurrencyCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.currency_name || !req.body.currency_acronym) {
			return responseResult(
				false,
				"currency_name or currency_acronym is empty"
			);
		}

		const newCurrencyPayload = { ...req.body, id: uuidv4() };

		const result = await this.currencyService.createCurrency(
			newCurrencyPayload
		);
		return result;
	}

	async patchCurrency(
		req: Request<{ id: string }, {}, ICurrencyEditPayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.currency_name || !req.body.currency_acronym || !req.body.id) {
			return responseResult(
				false,
				"Field id or currency_name or currency_acronym is empty"
			);
		}

		const result = await this.currencyService.editCurrency(req.body);
		return result;
	}

	async deleteCurrency(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.currencyService.deleteCurrency(req.params.id);
		return result;
	}
}
