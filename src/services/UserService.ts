import { User, UserRow } from "../types/user/types";
import { UserRepository } from "../repositories/_index";

export class UserService {
	userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	/* public async getUser(
		email: string
	): Promise<{ success: boolean; result: User }> {
		const resultUserRecord = await this.userRepository.getUserRecordByEMail(
			email
		);

		if (!resultUserRecord.success) {
			return { success: false, result: <User>{} };
		}

		const data: UserRecord = <UserRecord>resultUserRecord.result;
		const user = <User>{
			id: data.id,
			name: data.name,
			description: data.description,
			email: data.email,
			pass: data.pass,
		};

		return { success: true, result: user };
	} */
}
