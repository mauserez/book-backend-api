import { Decimal } from "@prisma/client/runtime/library";

import { IBookRow } from "../book/types";

export interface IRatingRow {
	id: string;
	value: number | Decimal;
	comment: string | null;
	book_id: IBookRow["id"];
	user_id: string;
}

export interface IRatingCreatePayload {
	value: number | Decimal;
	comment?: string;
	book_id: IBookRow["id"];
	user_id: string;
}

export interface IRatingEditPayload {
	id: string;
	value?: number;
	comment?: string;
}
