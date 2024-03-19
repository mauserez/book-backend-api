import {
	createClient,
	SupabaseClient,
	PostgrestError,
} from "@supabase/supabase-js";

import {
	CurrencyRecord,
	CategoryRecord,
	BookRecord,
	Book_AuthorRecord,
	Category_BookRecord,
} from "../types/book/types";

import { AuthorRecord } from "../types/author/types";
import { RatingRecord } from "../types/rating/types";

type T = {} | string;

export class BookRepository {
	private supabase: SupabaseClient;

	constructor() {
		const supabaseUrl = "https://egszhmnzhnkxlbdvxxrn.supabase.co";
		const supabaseKey = <string>process.env.SUPABASE_KEY;
		this.supabase = createClient(supabaseUrl, supabaseKey);
	}

	public async getAllFromTable(
		tableName: string,
		filter:
			| { field: string; values: string[] | number[] | Date[] | boolean[] }
			| undefined = undefined,
		limit: number | undefined = undefined,
		rangeFrom: number | undefined = undefined,
		rangeTo: number | undefined = undefined
	): Promise<{ success: boolean; result: T[] | PostgrestError }> {
		// Если мы не используем ORM
		//const booksList:Book[] = await this.supabase.query'SELECT * from "BOOKS"';

		let resultSelect;
		let condition =
			String(!filter ? 0 : 1) +
			String(rangeFrom === undefined || rangeTo === undefined ? 0 : 1) +
			String(!limit ? 0 : 1);
		switch (condition) {
			case "000":
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.returns<T[]>();
				break;
			case "001":
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.limit(<number>limit)
					.returns<T[]>();
				break;
			case "010":
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.range(<number>rangeFrom, <number>rangeTo)
					.returns<T[]>();
				break;
			case "011":
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.range(<number>rangeFrom, <number>rangeTo)
					.limit(<number>limit)
					.returns<T[]>();
				break;
			case "100":
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.in(<string>filter?.field, <[]>filter?.values)
					.returns<T[]>();
				break;
			case "101":
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.in(<string>filter?.field, <[]>filter?.values)
					.limit(<number>limit)
					.returns<T[]>();
				break;
			case "110":
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.in(<string>filter?.field, <[]>filter?.values)
					.range(<number>rangeFrom, <number>rangeTo)
					.returns<T[]>();
				break;
			case "111":
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.in(<string>filter?.field, <[]>filter?.values)
					.range(<number>rangeFrom, <number>rangeTo)
					.limit(<number>limit)
					.returns<T[]>();
				break;
			default:
				resultSelect = await this.supabase
					.from(tableName)
					.select()
					.returns<T[]>();
		}

		if (resultSelect.status === 200)
			return { success: true, result: <T[]>resultSelect.data };
		else return { success: false, result: <PostgrestError>resultSelect.error };
	}

	// вставка записи в таблицу, перед тем как вставить если есть name - проверяет на дубли и если есть вернет существующий
	public async postRecord(
		tableName: string,
		record: T
	): Promise<{ success: boolean; result: T | PostgrestError | null }> {
		const recordSelect:
			| CategoryRecord
			| CurrencyRecord
			| AuthorRecord
			| BookRecord = <
			CategoryRecord | CurrencyRecord | AuthorRecord | BookRecord
		>record;

		if (recordSelect.name != undefined && tableName != "user") {
			const resultSelect = await this.supabase
				.from(tableName)
				.select()
				.eq("name", recordSelect.name)
				.returns<T[]>();

			if (resultSelect.status === 200) {
				if (resultSelect.data != undefined && resultSelect.data.length > 0)
					return { success: true, result: resultSelect.data[0] };
			} else {
				console.log(
					"Ошибка в менент проверики есть ли уже записи с таким name",
					resultSelect.error
				);
				return { success: false, result: <PostgrestError>resultSelect.error };
			}
		}

		//Далее проверю по парам ключей
		// Category_BookRecord
		const recordSelect1: Category_BookRecord = <Category_BookRecord>record;
		if (
			recordSelect1.id_book != undefined &&
			recordSelect1.id_category != undefined
		) {
			const resultSelect1 = await this.supabase
				.from(tableName)
				.select()
				.eq("id_book", recordSelect1.id_book)
				.eq("id_category", recordSelect1.id_category)
				.returns<Category_BookRecord[]>();

			if (resultSelect1.status === 200) {
				if (resultSelect1.data != undefined && resultSelect1.data.length > 0)
					return { success: true, result: resultSelect1.data[0] };
			} else {
				console.log(
					"Ошибка в менент проверики есть ли уже записи таблицы Category_Book",
					resultSelect1.error
				);
				return { success: false, result: <PostgrestError>resultSelect1.error };
			}
		}

		// Book_AuthorRecord
		const recordSelect2: Book_AuthorRecord = <Book_AuthorRecord>record;
		if (
			recordSelect2.id_book != undefined &&
			recordSelect2.id_author != undefined
		) {
			const resultSelect2 = await this.supabase
				.from(tableName)
				.select()
				.eq("id_book", recordSelect2.id_book)
				.eq("id_author", recordSelect2.id_author)
				.returns<Book_AuthorRecord[]>();

			if (resultSelect2.status === 200) {
				if (resultSelect2.data != undefined && resultSelect2.data.length > 0)
					return { success: true, result: resultSelect2.data[0] };
			} else {
				console.log(
					"Ошибка в менент проверики есть ли уже записи таблицы Book_Author",
					resultSelect2.error
				);
				return { success: false, result: <PostgrestError>resultSelect2.error };
			}
		}

		// RaitingRecord
		const recordSelect3: RatingRecord = <RatingRecord>record;
		if (
			recordSelect3.id_book != undefined &&
			recordSelect3.id_user != undefined
		) {
			const resultSelect3 = await this.supabase
				.from(tableName)
				.select()
				.eq("id_book", recordSelect3.id_book)
				.eq("id_user", recordSelect3.id_user)
				.returns<Book_AuthorRecord[]>();
			if (resultSelect3.status === 200) {
				if (resultSelect3.data != undefined && resultSelect3.data.length > 0) {
					// Запись  уже есть надо только обновить рейтинг в той же записи
					const resultUpdate3 = await this.supabase
						.from(tableName)
						.upsert({
							id: resultSelect3.data[0].id,
							id_book: recordSelect3.id_book,
							id_user: recordSelect3.id_user,
							value: recordSelect3.value,
						})
						.select();

					if (resultUpdate3.status === 201) {
						if (
							resultUpdate3.data != undefined &&
							resultUpdate3.data.length > 0
						)
							return { success: true, result: resultUpdate3.data[0] };
					} else console.log(resultUpdate3.error);
					return {
						success: false,
						result: <PostgrestError>resultUpdate3.error,
					};
				}
			} else {
				console.log(
					"Ошибка в менент проверики есть ли уже записи таблицы Raiting",
					resultSelect3.error
				);
				return { success: false, result: <PostgrestError>resultSelect3.error };
			}
		}

		// если нет существующего то добавлю и верну добавленный
		// добавляю и если id уже есть вылетит с ошибкой
		const { data, error, status } = await this.supabase
			.from(tableName)
			.insert(record)
			.select()
			.returns<T[]>();
		if (status === 201) {
			if (data?.length) return { success: true, result: data[0] };
			return { success: true, result: <T>{} };
		} else {
			console.log("Ошибка в момент добавления записи", error);
			return { success: false, result: error };
		}
	}

	//Удаление всех записей книги
	public async deleteRowsByBookId(
		tableName: string,
		id_book: number
	): Promise<{ success: boolean; result: PostgrestError | null }> {
		const resultDelete = await this.supabase
			.from(tableName)
			.delete()
			.eq("id_book", id_book);

		if (resultDelete.status === 204) {
			// if resultDelete.statusText= 'No Content'
			return { success: true, result: null };
		} else {
			return { success: false, result: <PostgrestError>resultDelete.error };
		}
	}
}
