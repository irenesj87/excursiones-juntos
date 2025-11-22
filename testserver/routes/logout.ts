import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { authenticateToken } from "../authMiddleware.js";
import tokenBlocklist from "../data/tokenBlocklist.js";

const router = express.Router();

// Extendemos la interfaz Request de Express para incluir la propiedad `token`
// que es añadida por el middleware `authenticateToken`.
interface AuthenticatedRequest extends Request {
	token?: string;
}

// Rate limiter para proteger el endpoint de logout contra el abuso.
const logoutLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 50, // Limita cada IP a 50 peticiones de logout por ventana de tiempo.
	standardHeaders: true,
	legacyHeaders: false,
	message:
		"Demasiadas peticiones de logout desde esta IP, por favor intente de nuevo después de 15 minutos.",
});

/**
 * DELETE /logout
 * Invalida el token de la sesión actual añadiéndolo a una lista de bloqueo.
 * Requiere un token de autenticación válido.
 */
router.delete(
	"/",
	logoutLimiter,
	authenticateToken,
	(req: AuthenticatedRequest, res: Response) => {
		const token = req.token; // Obtenido del middleware authenticateToken

		if (token) {
			// Añadir el token a la lista de bloqueo para invalidarlo
			tokenBlocklist.push(token);
			return res
				.status(200)
				.json({ message: "La sesión se ha cerrado correctamente." });
		}
		return res.status(400).json({ error: "No se proporcionó un token." });
	}
);

export default router;
