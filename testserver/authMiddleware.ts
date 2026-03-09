import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import tokenBlocklist from "./data/tokenBlocklist.js";
import type { CustomJwtPayload } from "./types/jwt";

/**
 * Middleware para verificar un token JWT presente en la cabecera de autorización.
 */
export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// 1. Extraer el token de la cabecera 'Authorization'.
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith("Bearer ")) {
		return next(
			createError(401, "Token no proporcionado o con formato incorrecto"),
		);
	}
	const token = authHeader.split(" ")[1];

	// 2. Verificar si el token está en la lista negra (blocklist).
	if (tokenBlocklist.has(token)) {
		return next(createError(403, "Token invalidado (cerró sesión)"));
	}
	try {
		// 3. Verificar y decodificar el token usando la clave secreta.
		const payload = jwt.verify(token, process.env.JWT_SECRET!);

		// 4. Type Guard de seguridad
		// Verificamos que el payload es un objeto y contiene la propiedad 'mail'.
		if (typeof payload === "object" && "mail" in payload) {
			// 5. Añadir el email del usuario al objeto Request para usarlo en rutas posteriores.
			req.userMail = (payload as CustomJwtPayload).mail;
			return next(); // El token es válido, continuamos.
		}
		throw new Error("El formato del payload del token es inválido");
	} catch (error) {
		// 6. Capturar errores de verificación (expirado, firma inválida, etc.).
		// Logueamos el error real en el servidor para depuración.
		if (process.env.NODE_ENV === "development") {
			console.error("Error de verificación de token:", error);
		}
		// Enviamos una respuesta genérica al cliente por seguridad.
		return next(createError(401, "Token inválido o expirado"));
	}
};
