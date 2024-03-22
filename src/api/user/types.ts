export interface User {
	id: string;
	name: string;
	description: string;
	email: string;
	pass: string;
}

// поле редактирования в запросе на дедактирование
export interface IUserPayload {
	name: string;
	description: string;
	email: string;
	pass: string;
}

/////////////////// DataBase records
export interface UserRow {
	id: string;
	name: string | null;
	description: string | null;
	login: string;
	password: string;
}
