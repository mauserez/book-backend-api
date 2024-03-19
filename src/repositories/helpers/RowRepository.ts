import {
	createClient,
	SupabaseClient,
	PostgrestError,
} from "@supabase/supabase-js";

export class RowRepository {
	private supabase: SupabaseClient;

	constructor() {
		const supabaseUrl = "https://egszhmnzhnkxlbdvxxrn.supabase.co";
		const supabaseKey = <string>process.env.SUPABASE_KEY;
		this.supabase = createClient(supabaseUrl, supabaseKey);
	}

	//запись по id
	public async getRow<T>(
		tableName: string,
		id: number
	): Promise<{ success: boolean; result: T | PostgrestError | null }> {
		const resultSelect = await this.supabase
			.from(tableName)
			.select()
			.eq("id", id)
			.returns<T[]>();

		if (resultSelect.status === 200) {
			if (!resultSelect.data) {
				return { success: false, result: <T>{} };
			} else if (resultSelect.data.length > 0) {
				return { success: true, result: resultSelect.data[0] };
			} else {
				return { success: false, result: <T>{} };
			}
		} else {
			console.log(resultSelect.error);
			return { success: false, result: <PostgrestError>resultSelect.error };
		}
	}

	//обновление записи по id
	public async updateRow<T>(
		tableName: string,
		record: T
	): Promise<{ success: boolean; result: T | PostgrestError | null }> {
		const resultUpdate = await this.supabase
			.from(tableName)
			.upsert(record)
			.select();

		if (resultUpdate.status === 201) {
			if (resultUpdate.data != undefined && resultUpdate.data.length > 0) {
				return { success: true, result: resultUpdate.data[0] };
			}
		} else {
			console.log(resultUpdate.error);
		}

		return { success: false, result: <PostgrestError>resultUpdate.error };
	}

	//вставка записи
	public async postRow<T>(
		tableName: string,
		record: T
	): Promise<{ success: boolean; result: T | PostgrestError | null }> {
		const { data, error, status } = await this.supabase
			.from(tableName)
			.insert(record)
			.select()
			.returns<T[]>();

		if (status === 201) {
			if (data?.length) {
				return { success: true, result: data[0] };
			}

			return { success: true, result: <T>{} };
		} else {
			console.log("Ошибка в момент добавления записи", error);
			return { success: false, result: error };
		}
	}

	//удаление записи по id
	public async deleteRow(
		tableName: string,
		id: number
	): Promise<{ success: boolean; result: PostgrestError | null }> {
		const resultDelete = await this.supabase
			.from(tableName)
			.delete()
			.eq("id", id);

		if (resultDelete.status === 204) {
			return { success: true, result: null };
		}

		return { success: false, result: <PostgrestError>resultDelete.error };
	}
}
