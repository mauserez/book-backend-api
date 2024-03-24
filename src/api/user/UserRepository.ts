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
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { JWT } from "../../core/middleware/AuthMiddleware";

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
			await prisma.user.update({ where: { id: userId }, data: user });

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
					user: { ...returnedUser },
				},
				<string>process.env.JWT_SECRET
			);

			return responseResult(true, token);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async refresh(jwt: string) {
		try {
			return jwtVerify(
				jwt,
				<string>process.env.JWT_SECRET,
				async (err, decoded) => {
					const decodedJwt = <JWT>decoded;
					if (err) {
						return responseResult(false, err.message);
					} else {
						const user = await prisma.user.findFirst({
							where: {
								login: decodedJwt.user.login,
							},
						});

						if (!user) {
							throw new Error("User credentials is not correct");
						}

						const returnedUser: Partial<IUserRow> = { ...user };
						delete returnedUser.password;

						const token = jwtSign(
							{
								exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
								user: { returnedUser },
							},
							<string>process.env.JWT_SECRET
						);

						return responseResult(true, token);
					}
				}
			);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
