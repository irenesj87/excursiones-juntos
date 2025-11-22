import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import tokenBlocklist from "./data/tokenBlocklist.js";

// Extendemos la interfaz Request de Express para incluir las propiedades
// que se añadirán al objeto de petición tras una autenticación exitosa.
export interface AuthenticatedRequest extends Request {
	tokenEmail?: string;
	token?: string;
}

export function authenticateToken(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.split(" ")[1]; // Formato: Bearer TOKEN

	if (token == null) {
		return res.sendStatus(401); // Unauthorized: No hay token
	}

	if (tokenBlocklist.includes(token)) {
		return res
			.status(403)
			.json({ error: "Forbidden: Token has been invalidated." });
	}

	const secretKey = process.env.JWT_SECRET;
	if (!secretKey) {
		console.error("FATAL ERROR: JWT_SECRET no está definida.");
		return res.status(500).json({ error: "Server configuration error." });
	}

	jwt.verify(token, secretKey, (err, payload) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				return res
					.status(401)
					.json({ error: "Unauthorized: Token has expired." });
			}
			return res.status(403).json({ error: "Forbidden: Invalid token." });
		}

		// Si el token es válido, adjuntamos los datos a la request.
		req.tokenEmail = (payload as JwtPayload).mail;
		req.token = token;
		next(); // Pasamos al siguiente middleware o ruta.
	});
}
