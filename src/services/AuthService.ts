import { User, UserRow, IUserPayload } from "../types/user/types";
import { UserRepository } from "../repositories/_index";
import { v4 as uuidv4 } from "uuid";

export class AuthService {
	userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	/* /////////////  ПОЛУЧИТЬ ЮЗЕРА по логину //////////////
	public async getUser(
		email: string
	): Promise<{ success: boolean; result: User }> {
		const resultUserRecord = await this.userRepository.getUserRecordByEMail(
			email
		);
		if (!resultUserRecord.success) return { success: false, result: <User>{} };
		const data: UserRecord = <UserRecord>resultUserRecord.result;

		const user = <User>{
			id: data.id,
			name: data.name,
			description: data.description,
			email: data.email,
			pass: data.pass,
		};
		return { success: true, result: user };
	}

	public async createUser(
		userData: IUserPayload
	): Promise<{ success: boolean; result: User }> {
		let user: User = <User>{};
		let resultuser = await postRow("user", {
			id: uuidv4(),
			name: userData.name,
			description: userData.description,
			email: userData.email,
			pass: userData.pass,
		}).then(
			(data) => {
				let userRecord: UserRecord = <UserRow>data.result;
				if (!userRecord) return;
				user.id = userRecord.id;
				user.name = userRecord.name;
				user.description = userRecord.description;
				user.email = userRecord.email;
				user.pass = userRecord.pass;

				return { success: true, result: user };
			},
			(error) => {
				console.log("error_add_user", error);
				return { success: false, result: user };
			}
		);

		if (resultuser?.success) {
			return resultuser;
		} else return { success: false, result: <User>{} };
	}

	public async editUser(
		userId: number,
		userData: IUserPayload
	): Promise<{ success: boolean; result: User }> {
		let user: User = <User>{};
		let resultuser = await this.rowRepository
			.updateRow("user", {
				id: userId,
				name: userData.name,
				description: userData.description,
				email: userData.email,
				pass: userData.pass,
			})
			.then(
				(data) => {
					const userRecord: UserRecord = <UserRecord>data.result;
					if (!userRecord) return;

					user.id = userRecord.id;
					user.name = userRecord.name;
					user.description = userRecord.description;
					user.email = userRecord.email;
					user.pass = userRecord.pass;

					return { success: true, result: user };
				},
				(error) => {
					console.log("error_add_user", error);
					return { success: false, result: user };
				}
			);

		if (resultuser?.success) return resultuser;
		else return { success: false, result: <User>{} };
	} */
}
