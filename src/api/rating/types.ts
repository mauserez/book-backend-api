import { Decimal } from "@prisma/client/runtime/library";

import { IBookRow } from "../book/types";

export interface IRatingRow {
	id: string;
	value: number | Decimal;
	comment: string | null;
	book_id: IBookRow["id"];
	user_id: string;
	user?: {
		login: string;
	};
	created_at: Date;
}

export interface IRatingRowPrepared {
	id: string;
	value: number;
	comment: string;
	book_id: IBookRow["id"];
	user_id: string;
	user_login?: string;
	created_at: string;
}

export interface IRatingSavePayload {
	id?: string;
	value: number;
	comment: string;
	book_id: IBookRow["id"];
}

export interface IRatingEditPayload {
	id: string;
	value?: number;
	comment?: string;
}

export type IRatingCommentsPayload = {
	book_id: string;
	page?: number;
};
