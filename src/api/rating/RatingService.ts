import {
	IRatingCommentsPayload,
	IRatingSavePayload,
	IRatingEditPayload,
} from "./types";
import { RatingRepository } from "./RatingRepository";

export class RatingService {
	ratingRepository: RatingRepository;

	constructor() {
		this.ratingRepository = new RatingRepository();
	}

	public async getRating(id: string) {
		return await this.ratingRepository.getRating(id);
	}

	public async saveRating(
		ratingPayload: Required<IRatingSavePayload & { user_id: string }>
	) {
		return this.ratingRepository.saveRating(ratingPayload);
	}

	public async editRating(ratingPayload: IRatingEditPayload) {
		return this.ratingRepository.editRating(ratingPayload);
	}

	public async deleteRating(id: string) {
		return await this.ratingRepository.deleteRating(id);
	}

	public async getBookComments(payload: IRatingCommentsPayload) {
		const limit = 10;
		const preparedPayload = { ...payload, page: payload.page || 1 };

		return await this.ratingRepository.getBookComments(preparedPayload, limit);
	}
}
