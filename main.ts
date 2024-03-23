import { RatingController } from "./src/api/rating/RatingController";
import { App } from "./src/App";
import * as dotenv from "dotenv";

import {
	AuthorController,
	BookController,
	CategoryController,
	CurrencyController,
	UserController,
} from "./src/core/controllers";

import {
	AuthorService,
	BookService,
	CategoryService,
	CurrencyService,
	RatingService,
	UserService,
} from "./src/core/services";

import { UserRepository } from "./src/core/repositories";

dotenv.config();

async function bootstrap() {
	const authorController = new AuthorController(new AuthorService());
	const bookController = new BookController(new BookService());
	const categoryController = new CategoryController(new CategoryService());
	const currencyController = new CurrencyController(new CurrencyService());
	const ratingController = new RatingController(new RatingService());
	const userController = new UserController(
		new UserService(),
		new UserRepository()
	);

	const app = new App(
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
