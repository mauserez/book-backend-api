import cors from "cors";
import express, { Express } from "express";

import { BookController, AuthController } from "./controllers/_index";
import { BooksRouter, UserRouter } from "./routers/_index";
import { LoggerMiddleware } from "./middlewares/_index";

export class App {
	private app: Express;
	private _loggerMiddleware: LoggerMiddleware;
	private booksRouter: BooksRouter;
	private userRouter: UserRouter;
	private readonly port: number;

	constructor(
		bookController: BookController,
		authController: AuthController
	) {
		this.app = express();
		this.port = Number(process.env.APP_PORT) || 5001;
		this.booksRouter = new BooksRouter(bookController);
		this.userRouter = new UserRouter(authController);
		this._loggerMiddleware = new LoggerMiddleware();
	}

	private configureRoutes() {
		//this.app.use("/api/v1", this.userRouter.router);
		this.app.use(
			"/api/v1",
			//this._loggerMiddleware.handle,
			this.booksRouter.router
		);
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
