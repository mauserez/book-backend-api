import { App } from "./src/App";
import * as dotenv from "dotenv";

import {
	AuthorController,
	AuthController,
	BookController,
	CategoryController,
	CurrencyController,
	RatingController,
	UserController,
} from "./src/core/controllers";

import {
	AuthService,
	AuthorService,
	BookService,
	CategoryService,
	CurrencyService,
	RatingService,
	UserService,
} from "./src/core/services";

dotenv.config();

async function bootstrap() {
	const authController = new AuthController(new AuthService());
	const authorController = new AuthorController(new AuthorService());
	const bookController = new BookController(new BookService());
	const categoryController = new CategoryController(new CategoryService());
	const currencyController = new CurrencyController(new CurrencyService());
	const ratingController = new RatingController(new RatingService());
	const userController = new UserController(new UserService());

	const app = new App(
		authController,
		authorController,
		bookController,
		categoryController,
		currencyController,
		ratingController,
		userController
	);

	await app.run();
}

bootstrap();
