import { responseResult } from "../../helpers/resultHelper";
import { IAuthLogin, IAuthRegister } from "./types";
import { AuthRepository } from "./AuthRepository";
import bcrypt from "bcrypt";
import { UserRepository } from "../user/UserRepository";

export class AuthService {
	authRepository: AuthRepository;
	userRepository: UserRepository;

	constructor() {
		this.authRepository = new AuthRepository();
		this.userRepository = new UserRepository();
	}

	public async register(credentials: IAuthRegister) {
		let { login, password } = credentials;

		const searchedAuth = await this.userRepository.getUserByLogin(login.trim());
		if (searchedAuth.success && searchedAuth.result) {
			return responseResult(false, "Auth already exists");
		}

		password = await bcrypt.hash(password, 10);

		return await this.authRepository.register({ login, password });
	}

	public async login(credentials: IAuthLogin) {
		return await this.authRepository.login(credentials);
	}

	/* public refreshToken(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(" ")[1];
			return this.authRepository.refresh(token);
		}
	}
 */
}
