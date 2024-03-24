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

	public async register(credentials: IUserRegister) {
		let { login, password } = credentials;

		const searchedUser = await this.userRepository.getUserByLogin(login.trim());
		if (searchedUser.success && searchedUser.result) {
			return responseResult(false, "User already exists");
		}

		password = await bcrypt.hash(password, 10);

		return await this.userRepository.register({ login, password });
	}

	public async login(credentials: IUserLogin) {
		return await this.userRepository.login(credentials);
	}

	/* public refreshToken(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(" ")[1];
			return this.userRepository.refresh(token);
		}
	}
 */
}
