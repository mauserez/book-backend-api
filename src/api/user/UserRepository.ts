import { UserRow } from "./types";
import prisma from "../../prisma";
import { errorText, responseResult } from "../../helpers/resultHelper";

export class UserRepository {
	// поиск в юзера таблице по login
	public async getUser(email: string) {
		try {
			const user = await prisma.user.findFirst({
				where: {
					login: email,
				},
			});

			responseResult<UserRow | null>(true, user);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
