import {
	IUserCreatePayload,
	IUserEditPayload,
	IUserLogin,
	IUserRegister,
	IUserRow,
} from "./types";
import { v4 as uuidv4 } from "uuid";
import { errorText, responseResult } from "../../helpers/resultHelper";
import prisma from "../../prisma";
import bcrypt from "bcrypt";
import { sign as jwtSign } from "jsonwebtoken";

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

	public async register(credentials: IUserRegister) {
		try {
			const { login, password } = credentials;
			const user = await prisma.user.create({
				data: { id: uuidv4(), login, password },
			});

			return responseResult(true, user);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async login(credentials: IUserLogin) {
		try {
			const { login, password } = credentials;
			const user = await prisma.user.findFirst({
				where: {
					login: login,
				},
			});

			if (!user) {
				throw new Error("User credentials is not correct");
			}

			const isPasswordCorrect = await bcrypt.compare(
				credentials.password,
				user.password
			);

			if (!isPasswordCorrect) {
				return responseResult(false, "Invalid credentials");
			}

			const returnedUser: Partial<IUserRow> = { ...user };
			delete returnedUser.password;

			const token = jwtSign(
				{
					exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
					data: { returnedUser },
				},
				<string>process.env.JWT_SECRET
			);

			return responseResult(true, token);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
