import { App } from "./src/App";
import * as dotenv from "dotenv";

import { AuthController, BookController } from "./src/controllers/_index";
import { AuthService, BookService } from "./src/services/_index";

dotenv.config();

async function bootstrap() {
	const bookController = new BookController(new BookService());
	const authController = new AuthController(new AuthService());
	// const categoryController = new CategoryController(new CategoryService(new CategoryRepository(new DBService())));

	const app = new App(bookController, authController);

	await app.run();
}

bootstrap();
