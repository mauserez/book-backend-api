import { IUserEditPayload, IUserFavoritePayload, IUserRow } from "./types";
import { errorText, responseResult } from "../../helpers/resultHelper";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../prisma";
import { BOOKS_SELECT } from "../book/BookRepository";

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

	public async toggleFavorite(payload: IUserFavoritePayload) {
		const { book_id, user_id } = payload;

		try {
			const result = await prisma.user_books.findFirst({
				where: {
					user_id: user_id,
					book_id: book_id,
				},
			});

			if (result) {
				await prisma.user_books.deleteMany({
					where: { AND: { book_id: book_id, user_id: user_id } },
				});
			} else {
				await prisma.user_books.create({
					data: {
						id: uuidv4(),
						book_id: book_id,
						user_id: user_id,
					},
				});
			}

			return responseResult(true, "success");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async isFavorite(payload: IUserFavoritePayload) {
		const { book_id, user_id } = payload;

		try {
			const result = await prisma.user_books.findFirst({
				where: {
					user_id: user_id,
					book_id: book_id,
				},
			});

			return responseResult(true, !!result);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async userBooks(userId: string) {
		try {
			const userBooks: any = await prisma.book.findMany({
				select: BOOKS_SELECT,
				where: {
					user_books: {
						some: {
							user_id: userId,
						},
					},
				},
			});

			return responseResult(true, userBooks);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
