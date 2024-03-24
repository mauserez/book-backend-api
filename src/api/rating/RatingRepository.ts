import { IRatingCreatePayload, IRatingEditPayload, IRatingRow } from "./types";
import { v4 as uuidv4 } from "uuid";
import { errorText, responseResult } from "../../helpers/resultHelper";
import prisma from "../../prisma";

export class RatingRepository {
	public async getRating(ratingId: string) {
		try {
			const rating = await prisma.rating.findUnique({
				where: { id: ratingId },
			});

			return responseResult<IRatingRow | null>(true, rating);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async createRating(rating: IRatingCreatePayload) {
		try {
			const ratingId = uuidv4();

			await prisma.rating.create({
				data: { ...rating, id: ratingId },
			});

			return responseResult(true, ratingId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async editRating(rating: IRatingEditPayload) {
		try {
			const ratingId = rating.id;
			await prisma.rating.update({ where: { id: ratingId }, data: rating });

			return responseResult(true, ratingId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async deleteRating(ratingId: string) {
		try {
			await prisma.rating.delete({
				where: {
					id: ratingId,
				},
			});

			return responseResult(true, "Deleted");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
