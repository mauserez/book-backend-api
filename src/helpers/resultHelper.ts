export const responseResult = <T>(success: boolean, result: T) => {
	return { success: success, result: result };
};

export const responseIdIsEmpty = (id: null | undefined | number | string) => {
	return responseResult(false, "Field id is empty");
};

export const errorText = (e: unknown) => {
	let message = "Something goes wrong";
	if (typeof e === "string") {
		message = e.toUpperCase(); // works, `e` narrowed to string
	} else if (e instanceof Error) {
		message = e.message; // works, `e` narrowed to Error
	}

	return message;
};
