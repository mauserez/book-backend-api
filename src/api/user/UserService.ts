import { IUserEditPayload, IUserFavoritePayload } from "./types";
import { UserRepository } from "./UserRepository";

export class UserService {
	userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	public async getUser(id: string) {
		return await this.userRepository.getUser(id);
	}

	public async editUser(userPayload: IUserEditPayload) {
		return this.userRepository.editUser(userPayload);
	}

	public async deleteUser(id: string) {
		return await this.userRepository.deleteUser(id);
	}

	public async getUsers() {
		return await this.userRepository.getUsers();
	}

	public async toggleFavorite(payload: IUserFavoritePayload) {
		return await this.userRepository.toggleFavorite(payload);
	}

	public async isFavorite(payload: IUserFavoritePayload) {
		return await this.userRepository.isFavorite(payload);
	}

	public async userBooks(userId: string) {
		return await this.userRepository.userBooks(userId);
	}
}
