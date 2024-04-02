export interface IAuthorRow {
	id: string;
	first_name: string;
	last_name: string;
	years_active: string | null;
}

export type IAuthorEditPayload = {
	id: string;
	first_name?: string;
	last_name?: string;
	years_active?: string;
};

export type IAuthorsSavePayload = IAuthorEditPayload[];

export type IAuthorsSavePayloadRequired = Required<IAuthorEditPayload>[];

export type IAuthorCreatePayload = Omit<IAuthorRow, "id">;
