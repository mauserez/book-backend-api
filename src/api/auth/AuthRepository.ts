import { IAuthLogin, IAuthRegister } from "./types";
import { IUserRow } from "../user/types";

import prisma from "../../prisma";
import { v4 as uuidv4 } from "uuid";
import { errorText, responseResult } from "../../helpers/resultHelper";

import bcrypt from "bcrypt";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { JWT } from "../../core/middleware/AuthMiddleware";

export class AuthRepository {
	public async register(credentials: IAuthRegister) {
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

	public async login(credentials: IAuthLogin) {
		try {
			const { login, password } = credentials;
			const user = await prisma.user.findFirst({
				where: {
					login: login,
				},
			});

			if (!user) {
				throw new Error("Auth credentials is not correct");
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
							throw new Error("Auth credentials is not correct");
						}

						const returnedAuth: Partial<IUserRow> = { ...user };
						delete returnedAuth.password;

						const token = jwtSign(
							{
								exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
								auth: { returnedAuth },
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
