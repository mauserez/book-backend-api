import { CategoryController } from "./api/category/CategoryController";
import cors from "cors";
import express, { Express } from "express";

import {
	AuthorController,
	BookController,
	CurrencyController,
	RatingController,
	UserController,
} from "./core/controllers";
import {
	BookRouter,
	UserRouter,
	CurrencyRouter,
	CategoryRouter,
	AuthorRouter,
	RatingRouter,
} from "./core/routers";
import { AuthMiddleware } from "./core/middleware";

export class App {
	private app: Express;
	private _auth: AuthMiddleware;
	private authorRouter: AuthorRouter;
	private booksRouter: BookRouter;
	private categoryRouter: CategoryRouter;
	private currencyRouter: CurrencyRouter;
	private ratingRouter: RatingRouter;
	private userRouter: UserRouter;
	private readonly port: number;

	constructor(
		authorController: AuthorController,
		bookController: BookController,
		categoryController: CategoryController,
		currencyController: CurrencyController,
		ratingController: RatingController,
		userController: UserController
	) {
		this.app = express();
		this.port = Number(process.env.APP_PORT) || 5001;
		this.authorRouter = new AuthorRouter(authorController);
		this.booksRouter = new BookRouter(bookController);
		this.categoryRouter = new CategoryRouter(categoryController);
		this.currencyRouter = new CurrencyRouter(currencyController);
		this.ratingRouter = new RatingRouter(ratingController);
		this.userRouter = new UserRouter(userController);
		this._auth = new AuthMiddleware();
	}

	private configureRoutes() {
		this.app.use("/api/v1", this._auth.verifyAuth, this.authorRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.booksRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.categoryRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.currencyRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.ratingRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.userRouter.router);
	}

	public async run() {
		this.app.use(cors());
		this.app.use(express.json());

		this.app.listen(this.port, () => {
			console.log("Приложение запущено!");
		});

		this.configureRoutes();
	}
}
