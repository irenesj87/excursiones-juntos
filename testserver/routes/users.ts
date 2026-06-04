import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import users, { User } from "../data/usersData.js";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import excursions from "../data/excursionsData.js";
import sanitizeHtml from "sanitize-html";
import { authenticateToken } from "../authMiddleware.js";
import {
	validateName,
	validateSurname,
	validateMail,
	validatePhone,
	validatePassword,
} from "../validations.js";

const router = express.Router();

// Middleware que dice si un usuario puede modificar info o no.
const authorizeUserModification = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// Obtenemos el correo asociado al token, añadido por el middleware authenticateToken.
	const emailFromToken = req.userMail;
	// Obtenemos el correo del usuario a modificar desde la URL.
	const targetMail = req.params["mail"];

	// Comprobación de seguridad y estrechamiento de tipos (type narrowing).
	// Nos aseguramos de que `targetMail` es una cadena de texto no vacía.
	if (typeof targetMail !== "string" || !targetMail) {
		return res.status(400).json({
			error:
				"Bad Request: El parámetro 'mail' en la URL es requerido y debe ser una cadena de texto.",
		});
	}

	if (!emailFromToken) {
		return res.status(400).json({
			error: "Bad Request: No se pudo verificar la identidad del token.",
		});
	}

	// Si el correo asociado al token no es el mismo que el correo del usuario que quiere actualizar su info...
	// Esta comprobación de seguridad se hace para que otro usuario no pueda modificar la info del usuario actual
	if (emailFromToken.toLowerCase() !== targetMail.toLowerCase()) {
		return res
			.status(403)
			.json({ error: "Forbidden: You can only update your own profile." });
	}
	next();
};

/** GET para obtener el correo del usuario */
router.get("/", (req: Request, res: Response) => {
	// Se excluye la contraseña de la respuesta por seguridad.
	const response = users.map(({ password, ...user }) => user);
	res.status(200).json(response);
});

// Límite para la creación de usuarios, para prevenir la creación masiva de cuentas.
const createUserLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hora
	max: 5, // Limita cada IP a 5 creaciones de cuenta por hora
	standardHeaders: true,
	legacyHeaders: false,
	message:
		"Demasiadas cuentas creadas desde esta IP, por favor intente de nuevo después de una hora.",
});

// Límite para proteger otros endpoints de API contra el abuso por parte de usuarios autenticados.
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 200, // Limita cada IP a 200 peticiones por ventana de tiempo. Es un límite generoso para uso normal.
	standardHeaders: true,
	legacyHeaders: false,
	message:
		"Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos.",
});

// Configuración de sanitización: eliminar todas las etiquetas HTML.
const sanitizeConfig = {
	allowedTags: [],
	allowedAttributes: {},
};

/** POST para crear un nuevo usuario */
router.post("/", createUserLimiter, async (req: Request, res: Response) => {
	// 1. Validación de los datos de entrada
	const { name, surname, mail, password: plainPassword, phone } = req.body;

	// Comprobar campos requeridos
	if (!name || !surname || !mail || !plainPassword) {
		return res.status(400).json({
			error: "Faltan campos requeridos (name, surname, mail, password).",
		});
	}

	// Validaciones de formato y seguridad (Espejo exacto del Frontend)
	if (!validateName(name)) {
		return res.status(400).json({ error: "El nombre no puede estar vacío." });
	}
	if (!validateSurname(surname)) {
		return res
			.status(400)
			.json({ error: "Los apellidos no pueden estar vacíos." });
	}
	if (!validateMail(mail)) {
		return res
			.status(400)
			.json({ error: "El formato del correo electrónico no es válido." });
	}

	if (phone && !validatePhone(phone)) {
		return res
			.status(400)
			.json({ error: "El formato del número de teléfono no es válido." });
	}

	if (!validatePassword(plainPassword)) {
		return res.status(400).json({
			error:
				"La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un carácter especial.",
		});
	}

	// Lógica de negocio (una vez que los datos son válidos)
	// Se comprueba si ya hay un usuario con ese correo
	const userFound = users.find(
		(user) => user.mail.toLowerCase() === mail.toLowerCase(),
	);

	if (userFound) {
		return res
			.status(409)
			.json({ error: "Ya existe un usuario con ese correo electrónico." });
	} else {
		// Se hashea la contraseña antes de guardarla para no almacenarla en texto plano.
		const hashedPassword = await bcrypt.hash(plainPassword, 10);
		// Se crea el nuevo objeto de usuario explícitamente para evitar vulnerabilidades de asignación masiva.
		const user: User = {
			id: uuidv4(), // Se genera un ID único y seguro
			name: sanitizeHtml(name.trim(), sanitizeConfig),
			surname: sanitizeHtml(surname.trim(), sanitizeConfig),
			mail: mail.toLowerCase(),
			phone: phone ? sanitizeHtml(phone.trim(), sanitizeConfig) : "", // El teléfono es opcional
			password: hashedPassword,
			excursions: [],
		};
		users.push(user);

		// Generamos un token JWT para el nuevo usuario
		const payload = { mail: user.mail };
		const secretKey = process.env.JWT_SECRET;
		if (!secretKey) {
			console.error("JWT_SECRET no está definida en las variables de entorno.");
			return res
				.status(500)
				.json({ error: "Error de configuración del servidor." });
		}
		const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

		// Se crea una copia del objeto de usuario para la respuesta, excluyendo la contraseña hasheada.
		const { password: _, ...userResponse } = user;
		// Se usa una ruta relativa para evitar vulnerabilidades de Host Header Injection.
		const locationUrl = `/users/${user.id}`;

		return res
			.status(201)
			.setHeader("Location", locationUrl) // La cabecera Location indica la URL del nuevo recurso creado.
			.json({ token: token, user: userResponse });
	}
});

/** PUT para actualizar la info del usuario */
router.put(
	"/:mail",
	apiLimiter,
	authenticateToken,
	authorizeUserModification,
	(req: Request, res: Response, next: NextFunction) => {
		// Evitar loguear directamente el mail del usuario en logs de producción.
		console.log(`PUT /users - Request received for user modification.`);
		try {
			// Obtenemos el correo del usuario a modificar
			const { mail: rawMail } = req.params;
			if (typeof rawMail !== "string" || !rawMail) {
				console.warn("Invalid 'mail' parameter in PUT /users/:mail request.");
				return res.status(400).json({
					error:
						"Bad Request: El parámetro 'mail' en la URL es requerido y debe ser una cadena de texto.",
				});
			}
			// Sanitizamos el parámetro para "descontaminar" el dato (untaint)
			const targetMail = rawMail.trim().toLowerCase();

			// Buscamos el usuario a actualizar
			const currentUser = users.find(
				(user) => user.mail.toLowerCase() === targetMail.toLowerCase(),
			);
			// Comprobamos si el usuario existe
			if (!currentUser) {
				console.warn("User modification failed: target user not found.");
				return res.status(404).json({ error: "User not found." });
			}

			// Y si existe, actualizamos la info del usuario
			// Actualización segura: Solo actualizamos los campos permitidos.
			const { name, surname, phone } = req.body;

			// Validación y actualización de campos
			if (name !== undefined) {
				if (!validateName(name)) {
					return res
						.status(400)
						.json({ error: "El nombre proporcionado no es válido." });
				}
				currentUser.name = sanitizeHtml(name.trim(), sanitizeConfig);
			}

			if (surname !== undefined) {
				if (!validateSurname(surname)) {
					return res
						.status(400)
						.json({ error: "El apellido proporcionado no es válido." });
				}
				currentUser.surname = sanitizeHtml(surname.trim(), sanitizeConfig);
			}

			if (phone !== undefined) {
				if (!validatePhone(phone)) {
					return res
						.status(400)
						.json({ error: "El teléfono proporcionado no es válido." });
				}
				currentUser.phone = sanitizeHtml(phone.trim(), sanitizeConfig);
			}

			const { password: _, ...userResponse } = currentUser;
			return res.status(200).json(userResponse);
		} catch (error) {
			// Pasamos el error al manejador global de app.ts
			next(error);
		}
	},
);

/** GET para obtener las excursiones a las que un usuario se ha apuntado */
router.get(
	"/:mail/excursions",
	apiLimiter,
	authenticateToken,
	authorizeUserModification,
	(req: Request, res: Response) => {
		// El correo del usuario ya ha sido validado por los middlewares
		const { mail: rawMail } = req.params;

		if (typeof rawMail !== "string" || !rawMail) {
			return res.status(400).json({
				error:
					"Bad Request: El parámetro 'mail' en la URL es requerido y debe ser una cadena de texto.",
			});
		}

		// Limpiamos el dato antes de usarlo en la lógica de búsqueda
		const userMail = rawMail.trim().toLowerCase();

		// Se busca al usuario por su correo electrónico
		const user = users.find(
			(u) => u.mail.toLowerCase() === userMail.toLowerCase(),
		);

		// Aunque el middleware ya protege, esta es una comprobación de seguridad adicional
		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		// Si el usuario no tiene excursiones, se retorna un array vacío para evitar trabajo innecesario
		if (!user.excursions || user.excursions.length === 0) {
			return res.json([]);
		}

		// Se filtran las excursiones para obtener solo aquellas a las que el usuario está apuntado
		const userExcursions = excursions.filter((excursion) =>
			user.excursions.includes(String(excursion.id)),
		);

		// Se retornan las excursiones del usuario en formato JSON
		res.json(userExcursions);
	},
);

/** POST para que un usuario se apunte a una excursión */
router.post(
	"/:mail/excursions",
	apiLimiter,
	authenticateToken,
	authorizeUserModification,
	(req: Request, res: Response, next: NextFunction) => {
		console.log(
			`POST /users/excursions - Request received for user to join excursion.`,
		);
		try {
			// Obtenemos el correo del usuario a modificar desde la URL
			const { mail: rawMail } = req.params;
			const { excursionId } = req.body;

			if (typeof rawMail !== "string" || !rawMail) {
				return res.status(400).json({
					error:
						"Bad Request: El parámetro 'mail' en la URL es requerido y debe ser una cadena de texto.",
				});
			}

			// Limpiamos el parámetro de la URL
			const targetMail = rawMail.trim().toLowerCase();

			// Validamos que el excursionId se ha enviado.
			if (excursionId === null || excursionId === undefined) {
				return res
					.status(400)
					.json({ message: "El ID de la excursión es requerido." });
			}

			const excursionExists = excursions.some((ex) => ex.id === excursionId);
			if (!excursionExists) {
				return res
					.status(404)
					.json({ message: "La excursión especificada no existe." });
			}

			// Buscamos el usuario a actualizar
			const currentUser = users.find(
				(user) => user.mail.toLowerCase() === targetMail.toLowerCase(),
			);
			// Comprobamos si el usuario existe
			if (!currentUser) {
				return res.status(404).json({ error: "User not found." });
			}

			// Verificamos si el usuario ya está apuntado para evitar duplicados.
			if (currentUser.excursions.includes(excursionId)) {
				return res
					.status(409)
					.json({ message: "Ya estás apuntado a esta excursión." });
			}

			// Se añade la excursión a su array de excursiones
			currentUser.excursions.push(excursionId);
			// Se retorna el usuario actualizado sin la contraseña
			const { password: _, ...userResponse } = currentUser;
			res.status(200).json(userResponse);
		} catch (error) {
			// Pasamos el error al manejador global de app.ts
			next(error);
		}
	},
);

export default router;
