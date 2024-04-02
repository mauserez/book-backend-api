import {
	ICategoryEditPayload,
	ICategoryRow,
	ICategorySavePayloadRequired,
} from "./types";

import { errorText, responseResult } from "../../helpers/resultHelper";
import prisma from "../../prisma";

export class CategoryRepository {
	public async getCategories() {
		try {
			const categories = await prisma.category.findMany({
				orderBy: {
					name: "asc",
				},
			});
			return responseResult<ICategoryRow[] | null>(true, categories);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async saveCategories(categories: ICategorySavePayloadRequired[]) {
		const categoryIds = categories.map((category) => category.id);

		try {
			await prisma.category.deleteMany({
				where: {
					NOT: {
						id: { in: categoryIds },
					},
				},
			});

			categories.map(async (category) => {
				await prisma.category.upsert({
					where: {
						id: category.id,
					},
					update: category,
					create: category,
				});
			});

			return responseResult(true, "Success");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async getCategory(categoryId: string) {
		try {
			const category = await prisma.category.findUnique({
				where: { id: categoryId },
			});

			return responseResult<ICategoryRow | null>(true, category);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async saveCategory(category: ICategoryEditPayload) {
		try {
			const categoryId = category.id;

			await prisma.category.upsert({
				where: {
					id: categoryId,
				},
				update: { name: category.name },
				create: category,
			});

			return responseResult(true, categoryId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async deleteCategory(categoryId: string) {
		try {
			await prisma.category.delete({
				where: {
					id: categoryId,
				},
			});

			return responseResult(true, "Deleted");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
