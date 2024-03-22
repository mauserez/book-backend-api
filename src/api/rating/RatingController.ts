import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { RatingService } from "./RatingService";
import { IRatingEditPayload, IRatingCreatePayload } from "./types";

import { responseResult } from "../../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";

export class RatingController extends Controller {
	private ratingService: RatingService;

	constructor(ratingService: RatingService) {
		super();
		this.ratingService = ratingService;
	}

	async getRating(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.ratingService.getRating(req.params.id);
		return result;
	}

	async postRating(
		req: Request<{}, {}, IRatingCreatePayload>,
		res: Response,
		next: NextFunction
	) {
		const body = req.body;
		if (!body.value || !body.user_id || !body.book_id) {
			return responseResult(
				false,
				"Fields value or user_id or book_id is empty"
			);
		}

		const newRatingPayload = { ...req.body, id: uuidv4() };

		const result = await this.ratingService.createRating(newRatingPayload);
		return result;
	}

	async patchRating(
		req: Request<{ id: string }, {}, IRatingEditPayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.id) {
			return responseResult(false, "Field id is empty");
		}

		const result = await this.ratingService.editRating(req.body);
		return result;
	}

	async deleteRating(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		next: NextFunction
	) {
		if (!req.params.id) {
			return responseResult(false, "Param id is empty");
		}

		const result = await this.ratingService.deleteRating(req.params.id);
		return result;
	}
}
