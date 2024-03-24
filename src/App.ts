import { CategoryController } from "./api/category/CategoryController";
import cors from "cors";
import express, { Express } from "express";
import bodyParser from "body-parser";
import session from "express-session";

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
import { JWT } from "./core/middleware/AuthMiddleware";

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
		this.app.use("/api/v1", this.userRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.authorRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.booksRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.categoryRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.currencyRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.ratingRouter.router);
	}

	public async run() {
		this.app.use((req, res, next) => {
			if (req.headers.authorization) {
				const decoded = this._auth.parseToken(req, res);

				if (decoded) {
					res.locals.user = decoded.user;
					res.locals.userId = decoded.user.id;
				}
			}
			next();
		});

		this.app.use(
			session({
				secret: <string>process.env.JWT_SECRET,
				resave: false,
				saveUninitialized: true,
				cookie: { secure: true },
			})
		);

		this.app.use(cors());
		this.app.use(bodyParser.json());
		this.app.use(express.urlencoded({ extended: true }));

		this.app.listen(this.port, () => {
			console.log("Приложение запущено!");
		});

		this.configureRoutes();
	}
}
