import { Request, Response, NextFunction } from "express";
import { Controller } from "../../core/Controller";

import { RatingService } from "./RatingService";
import {
	IRatingEditPayload,
	IRatingCommentsPayload,
	IRatingSavePayload,
} from "./types";

import { responseResult } from "../../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";

export class RatingController extends Controller {
	private ratingService: RatingService;

	constructor(ratingService: RatingService) {
		super();
		this.ratingService = ratingService;
	}

	async getBookComments(
		req: Request<{}, {}, {}, IRatingCommentsPayload>,
		res: Response,
		next: NextFunction
	) {
		if (!req.query.book_id) {
			return responseResult(false, "book_id is empty");
		}

		const result = await this.ratingService.getBookComments(req.query);
		return result;
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
		req: Request<{}, {}, IRatingSavePayload>,
		res: Response,
		next: NextFunction
	) {
		const body = req.body;
		if (!body.value || !body.book_id) {
			return responseResult(
				false,
				"Fields value or comment or book_id is empty"
			);
		}

		const newRatingPayload = {
			...req.body,
			...{ id: body.id || uuidv4(), user_id: res.locals.userId as string },
		};

		const result = await this.ratingService.saveRating(newRatingPayload);
		return result;
	}

	async patchRating(
		req: Request<{}, {}, IRatingEditPayload>,
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
