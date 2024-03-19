import cors from "cors";
import express, { Express } from "express";

import { BooksController, AuthController } from "./core/controllers";
import { BooksRouter, UserRouter } from "./core/routers";
import { LoggerMiddleware } from "./core/middlewares";

export class App {
	private app: Express;
	private _loggerMiddleware: LoggerMiddleware;
	private booksRouter: BooksRouter;
	private userRouter: UserRouter;
	private readonly port: number;

	constructor(
		booksController: BooksController,
		authController: AuthController
	) {
		this.app = express();
		this.port = Number(process.env.APP_PORT) || 5001;
		this.booksRouter = new BooksRouter(booksController);
		this.userRouter = new UserRouter(authController);
		this._loggerMiddleware = new LoggerMiddleware();
	}

	private configureRoutes() {
		this.app.use("/api/v1", this.userRouter.router);
		this.app.use(
			"/api/v1/books",
			this._loggerMiddleware.handle,
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
