import {
	IRatingCommentsPayload,
	IRatingSavePayload,
	IRatingEditPayload,
	IRatingRow,
	IRatingRowPrepared,
} from "./types";
import { v4 as uuidv4 } from "uuid";
import { errorText, responseResult } from "../../helpers/resultHelper";
import prisma from "../../prisma";

export class RatingRepository {
	private prepareRatingRow = (row: IRatingRow) => {
		return {
			id: row.id,
			value: Number(row.value),
			comment: String(row.comment),
			user_id: row.user_id,
			book_id: row.book_id,
			login: row.user?.login,
			created_at: String(row.created_at),
		};
	};

	public async getRating(ratingId: string) {
		try {
			const rating = await prisma.rating.findUnique({
				where: { id: ratingId },
			});

			return responseResult<IRatingRowPrepared | null>(
				true,
				rating ? this.prepareRatingRow(rating) : null
			);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async saveRating(
		rating: Required<IRatingSavePayload & { user_id: string }>
	) {
		try {
			await prisma.rating.upsert({
				create: rating,
				update: rating,
				where: {
					id: rating.id,
				},
			});

			return responseResult(true, rating.id);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async editRating(rating: IRatingEditPayload) {
		try {
			const ratingId = rating.id;
			await prisma.rating.update({
				where: { id: ratingId },
				data: {
					value: rating.value || undefined,
					comment: rating.comment || undefined,
				},
			});

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

	public async getBookComments(
		payload: Required<IRatingCommentsPayload>,
		limit: number
	) {
		const { book_id, page } = payload;
		const take = limit * page;
		const skip = 0;

		try {
			const rating = await prisma.rating.findMany({
				skip: skip,
				take: take,
				select: {
					id: true,
					value: true,
					comment: true,
					user_id: true,
					book_id: true,
					created_at: true,
					user: {
						select: {
							login: true,
						},
					},
				},
				where: { book_id: book_id },
				orderBy: { created_at: "desc" },
			});

			let comments: IRatingRowPrepared[] = [];
			if (rating.length > 0) {
				comments = rating.map((rate) => {
					return this.prepareRatingRow(rate);
				});
			}

			return responseResult<IRatingRowPrepared[]>(true, comments);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
