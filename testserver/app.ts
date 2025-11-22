import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

// Verificación de seguridad crítica: Asegurarse de que la clave secreta para JWT está definida.
if (!process.env.JWT_SECRET) {
	console.error("FATAL ERROR: JWT_SECRET no está definida en el archivo .env");
	process.exit(1); // Detiene la aplicación si la variable no está configurada.
}

import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Reemplazo de __dirname para Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import excursionsRouter from "./routes/excursions.js";
import loginRouter from "./routes/login.js";
import tokenRouter from "./routes/token.js";
import filtersRouter from "./routes/filters.js";
import logoutRouter from "./routes/logout.js";

const app = express();

// Deshabilitar la cabecera X-Powered-By por seguridad.
// Esto evita que se revele que el servidor usa Express.
app.disable("x-powered-by");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuración de CORS más segura
// Se define una lista de orígenes permitidos (whitelist).
// Es una buena práctica gestionar esta lista a través de variables de entorno.
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
	? process.env.CORS_ALLOWED_ORIGINS.split(",")
	: [];

const corsOptions: CorsOptions = {
	origin: (origin, callback: (err: Error | null, allow?: boolean) => void) => {
		// Permitir peticiones sin origen (como Postman)
		// o si el origen está en la lista blanca.
		if (!origin) {
			return callback(null, true);
		}
		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			// Usamos createError para generar un error HTTP estándar con código 403 (Forbidden).
			const error = createError(
				403,
				"Petición no permitida por la política de CORS"
			);
			callback(error);
		}
	},
};

app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/excursions", excursionsRouter);
app.use("/login", loginRouter);
app.use("/token", tokenRouter);
app.use("/filters", filtersRouter);
app.use("/logout", logoutRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
	next(createError(404));
});

// error handler
app.use(
	(
		err: createError.HttpError,
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		// Determinamos el código de estado del error. Si no tiene uno, es un error interno (500).
		const statusCode = err.status || 500;

		// Creamos el objeto de respuesta del error.
		const errorResponse = {
			message: err.message,
			// En desarrollo, añadimos el stack del error para facilitar la depuración.
			...(req.app.get("env") === "development" ? { stack: err.stack } : {}),
		};

		// Enviamos la respuesta en formato JSON con el código de estado correcto.
		res.status(statusCode).json(errorResponse);
	}
);

export default app;
