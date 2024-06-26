import {
	IAuthorCreatePayload,
	IAuthorEditPayload,
	IAuthorRow,
	IAuthorsSavePayload,
	IAuthorsSavePayloadRequired,
} from "./types";
import { v4 as uuidv4 } from "uuid";
import { errorText, responseResult } from "../../helpers/resultHelper";
import prisma from "../../prisma";

export class AuthorRepository {
	public async getAuthors() {
		try {
			const authors = await prisma.author.findMany({
				orderBy: { last_name: "asc" },
			});

			return responseResult<IAuthorRow[] | null>(true, authors);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async saveAuthors(authors: IAuthorsSavePayloadRequired) {
		const authorsIds = authors.map((author) => author.id);

		try {
			await prisma.author.deleteMany({
				where: {
					NOT: {
						id: { in: authorsIds },
					},
				},
			});

			authors.map(async (author) => {
				await prisma.author.upsert({
					where: {
						id: author.id,
					},
					update: author,
					create: author,
				});
			});

			return responseResult(true, "Success");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async getAuthor(authorId: string) {
		try {
			const author = await prisma.author.findUnique({
				where: { id: authorId },
			});

			return responseResult<IAuthorRow | null>(true, author);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async createAuthor(author: IAuthorCreatePayload) {
		try {
			const authorId = uuidv4();

			await prisma.author.create({
				data: { ...author, id: authorId },
			});

			return responseResult(true, authorId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async editAuthor(author: IAuthorEditPayload) {
		try {
			const authorId = author.id;
			await prisma.author.update({ where: { id: authorId }, data: author });

			return responseResult(true, "updated");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async deleteAuthor(authorId: string) {
		try {
			await prisma.author.delete({
				where: {
					id: authorId,
				},
			});

			return responseResult(true, "deleted");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
