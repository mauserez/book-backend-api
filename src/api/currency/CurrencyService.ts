import { ICurrencyCreatePayload, ICurrencyEditPayload } from "./types";
import { CurrencyRepository } from "./CurrencyRepository";

export class CurrencyService {
	currencyRepository: CurrencyRepository;

	constructor() {
		this.currencyRepository = new CurrencyRepository();
	}

	public async getCurrency(id: string) {
		return await this.currencyRepository.getCurrency(id);
	}

	public async createCurrency(currencyPayload: ICurrencyCreatePayload) {
		return this.currencyRepository.createCurrency(currencyPayload);
	}

	public async editCurrency(currencyPayload: ICurrencyEditPayload) {
		return this.currencyRepository.editCurrency(currencyPayload);
	}

	public async deleteCurrency(id: string) {
		return await this.currencyRepository.deleteCurrency(id);
	}

	public async getCurrencies() {
		return await this.currencyRepository.getCurrencies();
	}
}
