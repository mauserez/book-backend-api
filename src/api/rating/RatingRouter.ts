import { Router, Request, Response, NextFunction } from "express";
import { RatingController } from "./RatingController";
import { IRatingCreatePayload, IRatingEditPayload } from "./types";

export class RatingRouter {
	private _router: Router;
	constructor(ratingController: RatingController) {
		this._router = Router();

		//rating по id
		this._router.get(
			"/rating/book/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const rating = await ratingController.getRating(req, res, next);
				res.send(rating);
			}
		);

		//найти оценку rating по id
		this._router.get(
			"/rating/:id",
			async (req: Request<{ id: string }>, res, next) => {
				const rating = await ratingController.getRating(req, res, next);
				res.send(rating);
			}
		);

		//добавить оценку rating
		this._router.post(
			"/rating",
			async (
				req: Request<{}, {}, IRatingCreatePayload>,
				res: Response,
				next
			) => {
				const result = await ratingController.postRating(req, res, next);
				res.send(result);
			}
		);

		//отредактировать оценку rating
		this._router.patch(
			"/rating",
			async (
				req: Request<{}, {}, IRatingEditPayload>,
				res: Response,
				next: NextFunction
			) => {
				const result = await ratingController.patchRating(req, res, next);
				res.send(result);
			}
		);

		//удалить оценку rating
		this._router.delete(
			"/rating/:id",
			async (
				req: Request<{ id: string }>,
				res: Response,
				next: NextFunction
			) => {
				const result = await ratingController.deleteRating(req, res, next);
				res.send(result);
			}
		);
	}

	get router() {
		return this._router;
	}
}
