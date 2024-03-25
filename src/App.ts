import { CategoryController } from "./api/category/CategoryController";
import cors from "cors";
import express, { Express } from "express";
import bodyParser from "body-parser";
import session from "express-session";
/* import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "LogRocket Express API with Swagger",
			version: "0.1.0",
			description:
				"This is a simple CRUD API application made with Express and documented with Swagger",
			license: {
				name: "MIT",
				url: "https://spdx.org/licenses/MIT.html",
			},
			contact: {
				name: "LogRocket",
				url: "https://logrocket.com",
				email: "info@email.com",
			},
		},
		servers: [
			{
				url: "http://localhost:5001",
			},
		],
	},
	apis: [`${__dirname}/App.ts`],
};

console.log({ __dirname });

const specs = swaggerJsDoc(options); */

import {
	AuthController,
	AuthorController,
	BookController,
	CurrencyController,
	RatingController,
	UserController,
} from "./core/controllers";
import {
	AuthRouter,
	AuthorRouter,
	BookRouter,
	UserRouter,
	CurrencyRouter,
	CategoryRouter,
	RatingRouter,
} from "./core/routers";
import { AuthMiddleware } from "./core/middleware";

export class App {
	private app: Express;
	private _auth: AuthMiddleware;
	private authorRouter: AuthorRouter;
	private authRouter: AuthRouter;
	private booksRouter: BookRouter;
	private categoryRouter: CategoryRouter;
	private currencyRouter: CurrencyRouter;
	private ratingRouter: RatingRouter;
	private userRouter: UserRouter;
	private readonly port: number;

	constructor(
		authController: AuthController,
		authorController: AuthorController,
		bookController: BookController,
		categoryController: CategoryController,
		currencyController: CurrencyController,
		ratingController: RatingController,
		userController: UserController
	) {
		this.app = express();
		this.port = Number(process.env.APP_PORT) || 5001;
		this.authRouter = new AuthRouter(authController);
		this.authorRouter = new AuthorRouter(authorController);
		this.booksRouter = new BookRouter(bookController);
		this.categoryRouter = new CategoryRouter(categoryController);
		this.currencyRouter = new CurrencyRouter(currencyController);
		this.ratingRouter = new RatingRouter(ratingController);
		this.userRouter = new UserRouter(userController);
		this._auth = new AuthMiddleware();
	}

	private configureRoutes() {
		this.app.use("/api/v1", this.authRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.userRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.authorRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.booksRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.categoryRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.currencyRouter.router);
		this.app.use("/api/v1", this._auth.verifyAuth, this.ratingRouter.router);
	}

	public async run() {
		//this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
		this.app.use(function (req, res, next) {
			// Website you wish to allow to connect
			res.setHeader("Access-Control-Allow-Origin", "http://localhost");
			// Request methods you wish to allow
			res.setHeader(
				"Access-Control-Allow-Methods",
				"GET, POST, OPTIONS, PUT, PATCH, DELETE"
			);
			// Request headers you wish to allow
			res.setHeader(
				"Access-Control-Allow-Headers",
				"X-Requested-With,content-type"
			);
			// Set to true if you need the website to include cookies in the requests sent
			// to the API (e.g. in case you use sessions)
			//res.setHeader("Access-Control-Allow-Credentials", true);
			// Pass to next layer of middleware
			next();
		});

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
