import {
	ICurrencyCreatePayload,
	ICurrencyEditPayload,
	ICurrencyRow,
} from "./types";
import { v4 as uuidv4 } from "uuid";
import { errorText, responseResult } from "../../helpers/resultHelper";
import prisma from "../../prisma";

export class CurrencyRepository {
	public async getCurrencies() {
		try {
			const currencies = await prisma.currency.findMany();
			return responseResult<ICurrencyRow[] | null>(true, currencies);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async getCurrency(currencyId: string) {
		try {
			const currency = await prisma.currency.findUnique({
				where: { id: currencyId },
			});

			return responseResult<ICurrencyRow | null>(true, currency);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async createCurrency(currency: ICurrencyCreatePayload) {
		try {
			const currencyId = uuidv4();
			await prisma.currency.create({
				data: { ...currency, id: currencyId },
			});

			return responseResult(true, currencyId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async editCurrency(currency: ICurrencyEditPayload) {
		try {
			const currencyId = currency.id;
			await prisma.currency.update({
				where: { id: currencyId },
				data: currency,
			});

			return responseResult(true, currencyId);
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}

	public async deleteCurrency(currencyId: string) {
		try {
			await prisma.currency.delete({
				where: {
					id: currencyId,
				},
			});

			return responseResult(true, "Deleted");
		} catch (error) {
			return responseResult(false, errorText(error));
		}
	}
}
