import { token } from "./../../placeholders";
import { IAuthLogin, IAuthRegister } from "./types";
import { IUserRow } from "../user/types";

import prisma from "../../prisma";
import { v4 as uuidv4 } from "uuid";
import { errorText, responseResult } from "../../helpers/resultHelper";

import bcrypt from "bcrypt";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { JWT } from "../../core/middleware/AuthMiddleware";

export class AuthRepository {
	private returnTokenWithoutPassword = (user: IUserRow) => {
		const returnedUser: Partial<IUserRow> = { ...user };
		delete returnedUser.password;

		const token = jwtSign(
			{
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
				user: { ...returnedUser },
			},
			<string>process.env.JWT_SECRET
		);

		return token;
	};

	public async register(credentials: IAuthRegister) {
		try {
			const { login, password } = credentials;
			const user = await prisma.user.create({
				data: { id: uuidv4(), login, password },
			});
			const token = this.returnTokenWithoutPassword(user);
			return responseResult(true, token);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async login(credentials: IAuthLogin) {
		try {
			const { login, password } = credentials;
			const user = await prisma.user.findFirst({
				where: {
					login: login,
				},
			});

			if (!user) {
				throw new Error("Проверьте логин или пароль");
			}

			const isPasswordCorrect = await bcrypt.compare(password, user.password);

			if (!isPasswordCorrect) {
				return responseResult(false, "Проверьте логин или пароль");
			}

			const token = this.returnTokenWithoutPassword(user);

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
							throw new Error("Auth credentials is not correct");
						}

						const token = this.returnTokenWithoutPassword(user);

						return responseResult(true, token);
					}
				}
			);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
