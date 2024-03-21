import { UserRow } from "../types/user/types";
import prisma from "../prisma";
import { errorText, result } from "../helpers/resultHelper";

export class UserRepository {
	// поиск в юзера таблице по login
	public async getUser(email: string) {
		try {
			const user = await prisma.user.findFirst({
				where: {
					login: email,
				},
			});

			result<UserRow | null>(true, user);
		} catch (error) {
			return result(false, errorText(error));
		}
	}
}
