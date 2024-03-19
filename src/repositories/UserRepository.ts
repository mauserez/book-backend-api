import {
	createClient,
	SupabaseClient,
	PostgrestError,
} from "@supabase/supabase-js";

import { UserRecord } from "../types/user/types";
import {} from "@supabase/supabase-js";

export class UserRepository {
	private supabase: SupabaseClient;

	constructor() {
		const supabaseUrl = "https://egszhmnzhnkxlbdvxxrn.supabase.co";
		const supabaseKey = <string>process.env.SUPABASE_KEY;
		this.supabase = createClient(supabaseUrl, supabaseKey);
	}

	//  поиск в юзера таблице по мейлу
	public async getUserRecordByEMail(
		email: string
	): Promise<{ success: boolean; result: UserRecord | PostgrestError }> {
		const resultSelect = await this.supabase
			.from("user")
			.select()
			.eq("email", email)
			.returns<UserRecord[]>();
		if (resultSelect.status === 200) {
			if (!resultSelect.data) return { success: false, result: <UserRecord>{} };
			else if (resultSelect.data.length > 0)
				return { success: true, result: <UserRecord>resultSelect.data[0] };
			else return { success: false, result: <UserRecord>{} };
		} else {
			console.log(resultSelect.error);
			return { success: false, result: <PostgrestError>resultSelect.error };
		}
	}
}
