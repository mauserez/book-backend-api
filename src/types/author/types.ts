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

export type IAuthorCreatePayload = Omit<IAuthorRow, "id">;
