export interface ICategoryRow {
	id: string;
	name: string;
}

export interface ICategoryEditPayload {
	id: string;
	name: string;
}

export type ICategorySavePayload = Partial<ICategoryEditPayload>;
export type ICategorySavePayloadRequired = Required<ICategoryEditPayload>;

export type ICategoryCreatePayload = Omit<ICategoryEditPayload, "id">;
