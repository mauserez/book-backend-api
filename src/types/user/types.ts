export interface User {
	id: number;
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
export interface UserRecord {
	id: number;
	name: string;
	description: string;
	email: string;
	pass: string;
}
