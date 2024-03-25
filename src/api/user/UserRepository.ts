import { IUserEditPayload, IUserRow } from "./types";
import { errorText, responseResult } from "../../helpers/resultHelper";
import prisma from "../../prisma";

export class UserRepository {
	public async getUsers() {
		try {
			const users = await prisma.user.findMany();
			return responseResult<IUserRow[] | null>(true, users);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async getUser(userId: string) {
		try {
			const user = await prisma.user.findUnique({
				where: { id: userId },
			});

			return responseResult<IUserRow | null>(true, user);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async editUser(user: IUserEditPayload) {
		try {
			const userId = user.id;
			await prisma.user.update({
				where: { id: userId },
				data: {
					description: user.description || undefined,
					name: user.name || undefined,
				},
			});

			return responseResult(true, userId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async deleteUser(userId: string) {
		try {
			await prisma.user.delete({
				where: {
					id: userId,
				},
			});

			return responseResult(true, "deleted");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async getUserByLogin(login: string) {
		try {
			const user = await prisma.user.findFirst({
				where: {
					login: login,
				},
			});

			return user ? responseResult(true, user) : responseResult(false, null);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
