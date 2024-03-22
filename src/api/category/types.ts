export interface ICategoryRow {
	id: string;
	name: string;
}

export interface ICategoryEditPayload {
	id: string;
	name: string;
}

export type ICategoryCreatePayload = Omit<ICategoryEditPayload, "id">;
