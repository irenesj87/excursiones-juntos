const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { authenticateToken } = require("../authMiddleware");
const tokenBlocklist = require("../data/tokenBlocklist");

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
router.delete("/", logoutLimiter, authenticateToken, (req, res) => {
	const token = req.token; // Obtenido del middleware authenticateToken

	// Añadir el token a la lista de bloqueo para invalidarlo
	tokenBlocklist.push(token);
	return res
		.status(200)
		.json({ message: "La sesión se ha cerrado correctamente." });
});

module.exports = router;
