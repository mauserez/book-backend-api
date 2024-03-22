import cors from "cors";
import express, { Express } from "express";

import { BookController, AuthController } from "./core/controllers";
import { BookRouter, UserRouter } from "./core/routers";
import { LoggerMiddleware } from "./core/middleware";

export class App {
	private app: Express;
	private _loggerMiddleware: LoggerMiddleware;
	private booksRouter: BookRouter;
	private userRouter: UserRouter;
	private readonly port: number;

	constructor(bookController: BookController, authController: AuthController) {
		this.app = express();
		this.port = Number(process.env.APP_PORT) || 5001;
		this.booksRouter = new BookRouter(bookController);
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
