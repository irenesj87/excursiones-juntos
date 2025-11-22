import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import users from "../data/usersData.js";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

const router = express.Router();

// Rate limiter para proteger el endpoint de login contra ataques de fuerza bruta.
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 5, // Limita cada IP a 5 intentos de login por ventana de tiempo. Es bajo para ser más seguro.
	standardHeaders: true,
	legacyHeaders: false,
	message:
		"Demasiados intentos de login desde esta IP, por favor intente de nuevo después de 15 minutos.",
});

/** LOGIN */
router.post("/", loginLimiter, async (req: Request, res: Response) => {
	// Obtenemos el correo y la contraseña del usuario que se quiere loguear
	const { mail, password } = req.body;

	// 1. Buscamos al usuario solo por su correo electrónico.
	const foundUser = users.find(
		(user) => user.mail.toLowerCase() === mail.toLowerCase()
	);

	// 2. Si se encuentra el usuario, comparamos la contraseña proporcionada con el hash almacenado.
	// bcrypt.compare se encarga de forma segura de la comparación.
	const passwordMatch = foundUser
		? await bcrypt.compare(password, foundUser.password)
		: false;

	// Si el usuario no existe o la contraseña no coincide, devolvemos un error genérico.
	if (!foundUser || !passwordMatch) {
		return res
			.status(401)
			.json({ error: "Datos erróneos. Inténtalo de nuevo." });
	} else {
		// 1. Crear el payload (la información que queremos guardar en el token)
		const payload = { mail: foundUser.mail };

		// 2. Firmar el token con una clave secreta y establecer una expiración (ej: 1 hora)
		// ¡IMPORTANTE! La clave secreta debe ser más compleja y guardarse de forma segura (ej: en variables de entorno).
		const secretKey = process.env.JWT_SECRET;
		if (!secretKey) {
			console.error("JWT_SECRET no está definida en las variables de entorno.");
			return res
				.status(500)
				.json({ error: "Error de configuración del servidor." });
		}
		const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

		// Se crea una copia del objeto de usuario para la respuesta, excluyendo la contraseña hasheada.
		const { password: _, ...userResponse } = foundUser;

		/* Después enviamos el token y el usuario al cliente. Se manda el token para que el usuario pueda autenticar futuras 
		peticiones y se manda el usuario, sin datos sensibles, para que el cliente tenga disponible su información en caso de
		que haya que mostrarla. */
		return res.status(200).json({ token: token, user: userResponse });
	}
});

export default router;
