export interface ICurrencyRow {
	id: string;
	currency_name: string;
	currency_acronym: string;
}

export type ICurrencyEditPayload = {
	id: string;
	currency_name: string;
	currency_acronym: string;
};

export type ICurrencyCreatePayload = Omit<ICurrencyRow, "id">;
