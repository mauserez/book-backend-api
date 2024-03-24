import { responseResult } from "../../helpers/resultHelper";
import {
	IUserCreatePayload,
	IUserEditPayload,
	IUserLogin,
	IUserRegister,
} from "./types";
import { UserRepository } from "./UserRepository";
import bcrypt from "bcrypt";

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
}
