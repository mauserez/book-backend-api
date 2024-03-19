// поле редактирования в запросе на редактирование
export interface Field {
	field: string;
	value: [Field[]] | Field[] | string | number | Date | undefined;
}

export interface FieldRecord {
	field: string;
	value: string | number | Date | null;
}
