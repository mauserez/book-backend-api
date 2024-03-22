import { IRatingCreatePayload, IRatingEditPayload } from "./types";
import { RatingRepository } from "./RatingRepository";

export class RatingService {
	ratingRepository: RatingRepository;

	constructor() {
		this.ratingRepository = new RatingRepository();
	}

	public async getRating(id: string) {
		return await this.ratingRepository.getRating(id);
	}

	public async createRating(ratingPayload: IRatingCreatePayload) {
		return this.ratingRepository.createRating(ratingPayload);
	}

	public async editRating(ratingPayload: IRatingEditPayload) {
		return this.ratingRepository.editRating(ratingPayload);
	}

	public async deleteRating(id: string) {
		return await this.ratingRepository.deleteRating(id);
	}
}
