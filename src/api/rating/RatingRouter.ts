import { Router, Request, Response, NextFunction } from "express";
import { RatingController } from "./RatingController";
import {
	IRatingSavePayload,
	IRatingEditPayload,
	IRatingCommentsPayload,
} from "./types";
import { AuthMiddleware } from "../../core/middleware";

export class RatingRouter {
	private _router: Router;
	constructor(
		ratingController: RatingController,
		authMiddleware: AuthMiddleware
	) {
		this._router = Router();

		//rating по id
		this._router.get(
			"/rating/book-comments",
			async (req: Request<{}, {}, {}, IRatingCommentsPayload>, res, next) => {
				const rating = await ratingController.getBookComments(req, res, next);
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

		//добавить комментарий с оценкой или изменить
		this._router.post(
			"/rating",
			authMiddleware.verifyAuth,
			async (req: Request<{}, {}, IRatingSavePayload>, res: Response, next) => {
				const result = await ratingController.postRating(req, res, next);
				res.send(result);
			}
		);

		//отредактировать оценку rating
		this._router.patch(
			"/rating",
			authMiddleware.verifyAuth,
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
			authMiddleware.verifyAuth,
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
