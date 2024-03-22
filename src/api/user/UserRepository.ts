import { IUserCreatePayload, IUserEditPayload, IUserRow } from "./types";
import { v4 as uuidv4 } from "uuid";
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

	public async createUser(user: IUserCreatePayload) {
		try {
			const userId = uuidv4();

			prisma.user.create({
				data: { ...user, id: userId },
			});

			return responseResult(true, "Saved");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async editUser(user: IUserEditPayload) {
		try {
			const userId = user.id;
			prisma.user.update({ where: { id: userId }, data: user });

			return responseResult(true, "Updated");
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

			return responseResult(true, "Deleted");
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

			return responseResult(true, user);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
