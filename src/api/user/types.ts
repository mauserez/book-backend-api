export interface IUserRow {
	id: string;
	name: string | null;
	description: string | null;
	login: string;
	password: string;
}

export type IUserEditPayload = {
	id: string;
	name?: string;
	description?: string;
};

export type IUserCreatePayload = {
	login: string;
	password: string;
};

export type IUserLogin = IUserCreatePayload;
export type IUserRegister = IUserLogin;
