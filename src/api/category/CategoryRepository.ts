import { ICategoryEditPayload, ICategoryRow } from "./types";
import { errorText, responseResult } from "../../helpers/resultHelper";
import prisma from "../../prisma";

export class CategoryRepository {
	public async getCategories() {
		try {
			const categories = await prisma.category.findMany();
			return responseResult<ICategoryRow[] | null>(true, categories);
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

			prisma.category.upsert({
				where: {
					id: categoryId,
				},
				update: { name: category.name },
				create: category,
			});

			return responseResult(true, "Saved");
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
