import { App } from "./src/App";
import * as dotenv from "dotenv";

import { AuthController, BooksController } from "./src/controllers/_index";
import { AuthService, BooksService } from "./src/services/_index";

dotenv.config();

async function bootstrap() {
	const bookController = new BooksController(new BooksService());
	const authController = new AuthController(new AuthService());
	// const categoryController = new CategoryController(new CategoryService(new CategoryRepository(new DBService())));

	const app = new App(bookController, authController);

	await app.run();
}

bootstrap();
