const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../data/usersData");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const excursions = require("../data/excursionsData");
const { authenticateToken } = require("../authMiddleware");

// Middleware que dice si un usuario puede modificar info o no
const authorizeUserModification = (req, res, next) => {
	// Obtenemos el correo asociado al token
	const emailFromToken = req.tokenEmail; // Lo da el middleware authenticateToken
	// Obtenemos el correo del usuario a modificar desde la URL
	const targetMail = req.params["mail"];

	// Comprobación de seguridad: Asegurarse de que ambas variables existen.
	if (!emailFromToken || !targetMail) {
		return res.status(400).json({
			error: "Bad Request: No se pudo verificar la identidad del usuario.",
		});
	}

	// Si el correo asociado al token no es el mismo que el correo del usuario que quiere actualizar su info...
	// Esta comprobación de seguridad se hace para que otro usuario no pueda modificar la info del usuario actual
	if (emailFromToken.toLowerCase() !== targetMail.toLowerCase()) {
		// ...se avisa del error
		console.log(
			`Authorization failed: Token email (${emailFromToken}) does not match target email (${targetMail}).`
		);
		return res
			.status(403)
			.json({ error: "Forbidden: You can only update your own profile." });
	}
	next();
};

/** GET para obtener el correo del usuario */
router.get("/", function (req, res, next) {
	// Se excluye la contraseña de la respuesta por seguridad.
	const response = users.map(({ password, ...user }) => user);
	res.status(200).json(response);
});

// Rate limiter para la creación de usuarios, para prevenir la creación masiva de cuentas.
const createUserLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hora
	max: 5, // Limita cada IP a 5 creaciones de cuenta por hora
	standardHeaders: true,
	legacyHeaders: false,
	message:
		"Demasiadas cuentas creadas desde esta IP, por favor intente de nuevo después de una hora.",
});

// Rate limiter para proteger otros endpoints de API contra el abuso por parte de usuarios autenticados.
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 200, // Limita cada IP a 200 peticiones por ventana de tiempo. Es un límite generoso para uso normal.
	standardHeaders: true,
	legacyHeaders: false,
	message:
		"Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos.",
});

/** POST para crear un nuevo usuario */
router.post("/", createUserLimiter, async function (req, res) {
	// 1. Validación de los datos de entrada
	const { name, surname, mail, password: plainPassword, phone } = req.body;

	// Comprobar campos requeridos
	if (!name || !surname || !mail || !plainPassword) {
		return res.status(400).json({
			error: "Faltan campos requeridos (name, surname, mail, password).",
		});
	}

	// Validar formato y contenido
	if (typeof name !== "string" || name.trim() === "") {
		return res.status(400).json({ error: "El nombre no es válido." });
	}
	if (typeof surname !== "string" || surname.trim() === "") {
		return res.status(400).json({ error: "El apellido no es válido." });
	}
	// Regex para validación de email recomendada por OWASP para prevenir ataques ReDoS.
	// Es más segura y específica que una expresión simple como /\S+@\S+\.\S+/.
	const emailRegex =
		/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
	if (typeof mail !== "string" || !emailRegex.test(mail)) {
		return res
			.status(400)
			.json({ error: "El formato del correo electrónico no es válido." });
	}
	if (typeof plainPassword !== "string" || plainPassword.length < 8) {
		return res
			.status(400)
			.json({ error: "La contraseña debe tener al menos 8 caracteres." });
	}

	// 2. Lógica de negocio (una vez que los datos son válidos)
	// Se comprueba si ya hay un usuario con ese correo
	const userFound = users.find(
		(user) => user.mail.toLowerCase() === mail.toLowerCase()
	);

	if (userFound) {
		return res
			.status(409)
			.json({ error: "Ya existe un usuario con ese correo electrónico." });
	} else {
		// Se hashea la contraseña antes de guardarla para no almacenarla en texto plano.
		const hashedPassword = await bcrypt.hash(plainPassword, 10);
		// Se crea el nuevo objeto de usuario explícitamente para evitar vulnerabilidades de asignación masiva.
		const user = {
			id: uuidv4(), // Se genera un ID único y seguro
			name: name.trim(),
			surname: surname.trim(),
			mail: mail.toLowerCase(),
			phone: phone ? phone.trim() : "", // El teléfono es opcional
			password: hashedPassword,
			excursions: [],
		};
		users.push(user);

		// Generamos un token JWT para el nuevo usuario
		const payload = { mail: user.mail };
		const secretKey = process.env.JWT_SECRET;
		const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

		// Se crea una copia del objeto de usuario para la respuesta, excluyendo la contraseña hasheada.
		const { password, ...userResponse } = user;
		// Se construye la URL de forma segura, evitando usar `req.originalUrl` para prevenir vulnerabilidades de Open Redirect.
		const locationUrl = `${req.protocol}://${req.get("host")}/users/${user.id}`;

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
	function (req, res, next) {
		console.log(`PUT /users/${req.params["mail"]} - Request received.`); // Log start
		try {
			// Obtenemos el correo del usuario a modificar
			const targetMail = req.params["mail"];
			console.log("Route Handler: Target user email from URL:", targetMail);
			// Buscamos el usuario a actualizar
			const currentUser = users.find(
				(user) => user.mail.toLowerCase() === targetMail.toLowerCase()
			);
			// Comprobamos si el usuario existe
			if (!currentUser) {
				console.log(`User with email ${targetMail} not found.`);
				return res.status(404).json({ error: "User not found." });
			}
			console.log("Found target user:", currentUser.mail);
			// Y si existe, actualizamos la info del usuario
			// Actualización segura: Solo actualizamos los campos permitidos.
			const { name, surname, phone } = req.body;

			// Validación y actualización de campos
			if (name !== undefined) {
				if (typeof name !== "string" || name.trim() === "") {
					return res
						.status(400)
						.json({ error: "El nombre proporcionado no es válido." });
				}
				currentUser.name = name.trim();
			}

			if (surname !== undefined) {
				if (typeof surname !== "string" || surname.trim() === "") {
					return res
						.status(400)
						.json({ error: "El apellido proporcionado no es válido." });
				}
				currentUser.surname = surname.trim();
			}

			if (phone !== undefined) {
				if (typeof phone !== "string" || phone.trim() === "") {
					return res
						.status(400)
						.json({ error: "El teléfono proporcionado no es válido." });
				}
				currentUser.phone = phone.trim();
			}

			const { password, ...userResponse } = currentUser;
			return res.status(200).json(userResponse);
		} catch (error) {
			console.error("Unexpected error in PUT /users/:mail:", error);
			return res.status(500).json({ error: "Internal Server Error occurred." });
		}
	}
);

/** GET para obtener las excursiones a las que un usuario se ha apuntado */
router.get(
	"/:mail/excursions",
	apiLimiter,
	authenticateToken,
	authorizeUserModification,
	function (req, res, next) {
		// El correo del usuario ya ha sido validado por los middlewares
		const userMail = req.params.mail;
		// Se busca al usuario por su correo electrónico
		const user = users.find(
			(u) => u.mail.toLowerCase() === userMail.toLowerCase()
		);

		// Aunque el middleware ya protege, esta es una comprobación de seguridad adicional
		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		// Si el usuario no tiene excursiones, se devuelve un array vacío para evitar trabajo innecesario
		if (!user.excursions || user.excursions.length === 0) {
			return res.json([]);
		}

		// Se filtran las excursiones para obtener solo aquellas a las que el usuario está apuntado
		const userExcursions = excursions.filter((excursion) =>
			user.excursions.includes(excursion.id)
		);

		// Se retornan las excursiones del usuario en formato JSON
		res.json(userExcursions);
	}
);

/** POST para que un usuario se apunte a una excursión */
router.post(
	"/:mail/excursions",
	apiLimiter,
	authenticateToken,
	authorizeUserModification,
	function (req, res, next) {
		console.log(
			`POST /users/${req.params["mail"]}/excursions - Request received.`
		);
		try {
			// Obtenemos el correo del usuario a modificar desde la URL
			const targetMail = req.params["mail"];
			// Obtenemos el ID de la excursión desde el cuerpo de la petición
			const { excursionId } = req.body;

			// Validamos que el excursionId se ha enviado.
			if (excursionId === null || excursionId === undefined) {
				return res
					.status(400)
					.json({ message: "El ID de la excursión es requerido." });
			}

			// Verificamos que la excursión a la que se apunta realmente existe.
			const excursionExists = excursions.some((ex) => ex.id === excursionId);
			if (!excursionExists) {
				return res
					.status(404)
					.json({ message: "La excursión especificada no existe." });
			}

			// Buscamos el usuario a actualizar
			const currentUser = users.find(
				(user) => user.mail.toLowerCase() === targetMail.toLowerCase()
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
			const { password, ...userResponse } = currentUser;
			res.status(200).json(userResponse);
		} catch (error) {
			console.error("Unexpected error in POST /users/:mail/excursions:", error);
			return res.status(500).json({ error: "Internal Server Error occurred." });
		}
	}
);

module.exports = router;
