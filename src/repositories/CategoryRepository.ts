import { ICategoryEditPayload, ICategoryRow } from "../types/category/types";
import { v4 as uuidv4 } from "uuid";
import { errorText, result } from "../helpers/resultHelper";
import prisma from "../prisma";

export class CategoryRepository {
	public async getCategories() {
		try {
			const categories = await prisma.category.findMany();
			return result<ICategoryRow[] | null>(true, categories);
		} catch (error) {
			return result(false, errorText(error));
		}
	}

	public async getCategory(categoryId: string) {
		try {
			const category = await prisma.book_view.findUnique({
				where: { id: categoryId },
			});

			return result<ICategoryRow | null>(true, category);
		} catch (error) {
			return result(false, errorText(error));
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

			return result(true, "Success");
		} catch (error) {
			return result(false, errorText(error));
		}
	}

	public async deleteCategory(categoryId: string) {
		try {
			await prisma.book.delete({
				where: {
					id: categoryId,
				},
			});

			return result(true, "Success");
		} catch (error) {
			return result(false, errorText(error));
		}
	}
}
